import { AccountDocument, AccountRaw } from "./account";
import {
  model,
  Schema,
  Document,
  SchemaOptions,
  PaginateModel,
} from "mongoose";
import mongooseAutopopulate from "mongoose-autopopulate";
import paginate from "mongoose-paginate-v2";

export enum USER_STATUS {
  ACTIVE = "active",
  DELETED = "deleted",
}

export interface UserRaw {
  account: AccountRaw;
  firstName: string;
  lastName: string;
}

export interface UserDocument extends UserRaw, Document {
  account: AccountDocument["_id"];
  createdAt: Date;
  updatedAt: Date;
  status: USER_STATUS;
}
export interface UserPopulatedDocument extends UserDocument {
  account: AccountDocument;
}

const schema = new Schema<UserDocument, UserModel>(
  {
    account: {
      type: String,
      required: true,
      ref: "Account",
      autopopulate: true,
    },
    firstName: {
      type: String,
      minlength: 1,
      maxlength: 200,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 1,
      maxlength: 200,
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUS,
      default: USER_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    _idPrefix: "U",
    discriminatorKey: "kind",
    collation: { locale: "en_US", strength: 1 },
  } as SchemaOptions
);

export interface UserModel extends PaginateModel<UserPopulatedDocument> {
  getById(id: string): Promise<UserPopulatedDocument>;
  search(query: string, limit?: number): Promise<[UserDocument]>;
}

schema.statics.getById = async function (this: UserModel, id: string) {
  return this.findById(id);
};

schema.statics.search = async function (
  this: UserModel,
  query: string,
  limit = 5
) {
  return this.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query,
          path: {
            wildcard: "*",
          },
          fuzzy: {},
        },
      },
    },
    {
      $project: {
        score: { $meta: "searchScore" },
        firstName: 1,
        lastName: 1,
        status: 1,
        account: 1,
      },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "accounts",
        let: { account: "$account" },
        as: "account",
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$account"] } } },
          { $project: { _id: 1, email: 1 } },
        ],
      },
    },
    {
      $unwind: "$account",
    },
  ]);
};

schema.plugin(mongooseAutopopulate);

schema.index({ account: 1 });
schema.index({ firstName: 1 });
schema.index({ lastName: 1 });

schema.plugin(paginate);

export default model<UserDocument, UserModel>("User", schema);

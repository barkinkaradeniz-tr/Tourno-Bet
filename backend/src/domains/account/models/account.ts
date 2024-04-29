import { model, Schema, Document, Model, SchemaOptions } from "mongoose";
import bcrypt from "bcrypt";

export interface AccountRaw {
  email: string;
  password: string;
}

export interface AccountDocument extends AccountRaw, Document {
  hash: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;

  validatePassword(password: string): boolean;
  updateHash(newPassword: string): AccountDocument;
}

const schema = new Schema<AccountDocument, AccountModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hash: {
      type: String,
      required: true,
      select: false,
    },
    approved: Boolean,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
    _idPrefix: "ACC",
  } as SchemaOptions
);

schema.statics.calculateHash = async function (
  this: AccountModel,
  password: string
) {
  return await bcrypt.hash(password, 10);
};

export interface AccountModel extends Model<AccountDocument> {
  calculateHash(password: string): Promise<string>;
}

schema.methods.validatePassword = function (
  this: AccountDocument,
  password: string
) {
  return bcrypt.compare(password, this.hash);
};

schema.methods.updateHash = async function (
  this: AccountDocument,
  newPassword: string
) {
  this.hash = await bcrypt.hash(newPassword, 10);

  return this.save();
};

schema.index({ email: 1 });

export default model<AccountDocument, AccountModel>("Account", schema);

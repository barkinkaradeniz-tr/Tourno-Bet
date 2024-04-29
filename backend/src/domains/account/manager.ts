import bcrypt from "bcrypt";
import _ from "lodash";
import User, { UserRaw, UserDocument, USER_STATUS } from "./models/user";
import Account, { AccountRaw, AccountDocument } from "./models/account";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedRequestError,
} from "../../lib/errors";

const createAccount = async (
  accountData: AccountRaw,
  options: { session?: any } = {}
) => {
  const existingAccount = await Account.findOne({
    email: accountData.email.toLowerCase(),
  }).session(options?.session);

  if (existingAccount)
    throw new BadRequestError(
      `There is already an account with email ${accountData.email}`
    );

  const [account] = await Account.create(
    [
      {
        ...accountData,
        hash: await Account.calculateHash(accountData.password),
      },
    ],
    options
  );

  if (!account) throw new Error("Account could not be created");

  return account;
};

export const getUserByEmail = async (email: string) => {
  email = email.toLowerCase();

  const account = await Account.findOne({ email });

  if (!account) throw new NotFoundError(`User with email=${email} not found`);

  const user = await User.findOne({
    account: account._id,
    status: { $nin: [USER_STATUS.DELETED] },
  }).populate("account");

  if (!user)
    throw new NotFoundError(
      `Account for email=${email} is found but user not found`
    );

  return user;
};

export const getUserByAccountId = async (accountId: string) => {
  const user = await User.findOne({
    account: accountId,
    status: { $nin: [USER_STATUS.DELETED] },
  }).populate("account");

  if (!user) throw new NotFoundError(`Invalid credentials.`);

  return user;
};

export const authenticate = async (email: string, password: string) => {
  email = email.toLowerCase();

  const account = await Account.findOne({ email }).select("+hash");

  if (!account) {
    throw new NotFoundError(`User not found`);
  }

  if (!(await account.validatePassword(password)))
    throw new UnauthorizedRequestError(`Invalid credentials`);

  return getUserByAccountId(account._id);
};

export const registerUser = async (rawUser: UserRaw, redirectUrl?: string) => {
  const account = await createAccount(rawUser.account);

  const guest = await User.create({
    account: account._id,
    firstName: rawUser.firstName,
    lastName: rawUser.lastName,
  });

  return guest;
};

export function serializeUser() {
  return function (user: any, cb: any) {
    cb(null, user.account._id);
  };
}

export function deserializeUser() {
  return (account: string, cb: any) => {
    return getUserByAccountId(account)
      .then((user) => {
        cb(null, user);
      })
      .catch(() => {
        cb(null, false);
      });
  };
}

export const changePassword = async (
  {
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  },
  account: AccountDocument
) => {
  const accountWithHash = await Account.findById(account._id).select("+hash");

  if (!(await accountWithHash.validatePassword(oldPassword)))
    throw new BadRequestError(`Invalid password`);

  await accountWithHash.updateHash(newPassword);

  return getUserByAccountId(accountWithHash._id);
};

export const resetPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  email = email.toLowerCase();

  const accountWithHash = await Account.findOne({ email }).select("+hash");

  await accountWithHash.updateHash(password);

  return getUserByAccountId(accountWithHash._id);
};

export const getAccountIdsByEmails = async (emails: string[]) => {
  const accounts = await Account.find({
    email: { $in: emails },
  })
    .select("_id")
    .lean();

  return accounts.map(({ _id }) => _id);
};

export const updateUserStatus = async (userId: string, status: USER_STATUS) => {
  return User.findByIdAndUpdate(userId, { status }, { new: true });
};

export const updateUser = async (
  userId: string,
  {
    data,
  }: {
    data: Partial<UserDocument>;
  }
) => {
  const updateData = _.omit(data, ["email"]);

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateData, {
    new: true,
  });

  return updatedUser;
};

export const hashString = async (str: string) => {
  return bcrypt.hash(str, 10);
};

import { UserDocument, USER_STATUS } from "../domains/account/models/user";
import User from "../domains/account/models/user";
import { NotFoundError } from "../lib/errors";
import * as AccountManager from "../domains/account/manager";

export const getUserById = async (id: string, actor: UserDocument) => {
  const user = await User.getById(id);

  if (!user) throw new NotFoundError(`User not found`);

  return user;
};

export const updateUserStatus = async (userId: string, status: USER_STATUS) => {
  return AccountManager.updateUserStatus(userId, status);
};

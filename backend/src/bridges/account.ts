import { NotFoundError } from "../lib/errors";
import Account from "../domains/account/models/account";

export const updateApproved = async (id: string, approved: boolean) => {
  const account = await Account.findById(id);

  if (!account) throw new NotFoundError(`Account not found`);

  account.approved = approved;

  return account.save();
};

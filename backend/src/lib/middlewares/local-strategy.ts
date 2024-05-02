import { Strategy as LocalStrategy } from "passport-local";
import * as AccountManager from "../../domains/account/manager";
import { UserDocument } from "../../domains/account/models/user";
import { RequestHandler } from "express";
import { UnauthorizedRequestError, BadRequestError } from "../errors";

export interface LoggedInRequest extends Express.Request {
  user: UserDocument;
  body: any;
  query: any;
  params: any;
}

export const ensureOrphands: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated())
    return next(
      new BadRequestError(
        "There is an ongoing session. Please logout in order to perform this action."
      )
    );
  next();
};

export const ensureAuthentication: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) return next(new UnauthorizedRequestError());

  const user = req.user as UserDocument;

  console.log(`Authenticated request from origin ${req.headers.origin}`);

  next();
};

export default new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await AccountManager.authenticate(email, password);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
);

import { AsyncRouter } from "express-async-router";
import { celebrate, Joi, Segments } from "celebrate";
import passport from "passport";
import passwordComplexity from "joi-password-complexity";
import * as AccountManager from "../domains/account/manager";
import {
  ensureAuthentication,
  LoggedInRequest,
  ensureOrphands,
  // ensureEmailVerified,
} from "../lib/middlewares/local-strategy";

const router = AsyncRouter();

router.get("/", ensureAuthentication, (req: LoggedInRequest) => {
  return req.user;
});

router.post(
  "/user",
  ensureOrphands,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: passwordComplexity(),
      firstName: Joi.string().required().min(2).max(128),
      lastName: Joi.string().required().min(2).max(128),
    }),
  }),
  async (req) => {
    const { email, password, ...rest } = req.body;

    const guest = await AccountManager.registerUser(
      {
        account: { email, password, emailVerified: false },
        ...rest,
      },
      req.query.redirectUrl as string
    );

    return req.login(guest, (err: any) => {
      if (err) throw err;

      return guest;
    });
  }
);

router.post(
  "/session",
  ensureOrphands,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string(),
    }),
  }),
  passport.authenticate("local", { failWithError: true }),
  (req: LoggedInRequest) => {
    return req.user;
  }
);

router.delete("/session", ensureAuthentication, (req, res) => {
  res.clearCookie("connect.sid");

  req.session.destroy((err) => {
    if (err) res.send(err).sendStatus(401);
    else req.logout(() => {});
  });
});

export default router;

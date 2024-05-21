import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import session from "express-session";
import compression from "compression";
import cookieParser from "cookie-parser";
import RedisInstance from "./lib/redis/index";
import * as AccountManager from "./domains/account/manager";
import LocalStrategy from "./lib/middlewares/local-strategy";

class App {
  public server: express.Application;
  public port: string | number;
  public env: string;

  constructor() {
    this.server = express();
    this.port = process.env.PORT || 4000;
    this.env = process.env.NODE_ENV || "development";

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  public listen(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        resolve();
      });
    });
  }

  private initializeMiddlewares() {
    this.server.use(
      bodyParser.json({
        verify: function (req: any, res: any, buf: any) {
          req.rawBody = buf.toString();
        },
      }),
    );

    this.server.use(
      cors({
        origin: true,
        credentials: Boolean(process.env.HTTP_CORS_CREDENTIALS),
      }),
    );

    this.server.use(
      bodyParser.text({ type: "application/xml", limit: "100mb" }),
    );

    this.server.set("trust proxy", 1);
    this.server.use(hpp());
    this.server.use(helmet());
    this.server.use(compression());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cookieParser());

    passport.use(LocalStrategy);
    passport.serializeUser(AccountManager.serializeUser());
    passport.deserializeUser(AccountManager.deserializeUser());

    this.server.use(
      session({
        store: RedisInstance.createSessionStore(),
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || "thisisasupersecuresecretsecret",
        resave: false,
        cookie: {
          domain:
            process.env.NODE_ENV === "production"
              ? ""
              : process.env.COOKIE_DOMAIN,
          maxAge: 14 * 24 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === "production" ? "none" : true,
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
        },
      }),
    );

    this.server.use(express.static("scripts"));
    this.server.use(passport.initialize());
    this.server.use(passport.session());
  }

  private initializeRoutes() {
    this.server.get("/health", (req, res) => res.json({ status: "ok" }));
    this.server.use("/account", require("./routes/account").default);
  }
}

export default App;

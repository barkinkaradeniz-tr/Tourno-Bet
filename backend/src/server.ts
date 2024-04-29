import express from "express";

class App {
  public server: express.Application;
  public port: string | number;
  public env: string;

  constructor() {
    this.server = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || "development";

    this.initializeRoutes();
  }

  public listen(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        resolve();
      });
    });
  }

  private initializeRoutes() {
    this.server.get("/health", (req, res) => res.json({ status: "ok" }));
    // this.server.use("/account", require("./routes/account").default);
  }
}

export default App;

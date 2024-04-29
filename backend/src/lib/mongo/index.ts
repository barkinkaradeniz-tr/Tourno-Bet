import mongoose from "mongoose";

class MongoDB {
  connectionString: string;

  constructor() {
    this.connectionString = process.env.MONGODB_SRC || "mongodb://localhost";
  }

  async init(connectionString?: string) {
    try {
      // mongoose.set('debug', true)
      await mongoose.connect(connectionString || this.connectionString);
    } catch (err) {
      throw err;
    }
  }

  get connection() {
    return mongoose.connection;
  }
}

const instance = new MongoDB();

export default instance;

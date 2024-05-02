require("dotenv").config();

import Server from "./server";
import Redis from "./lib/redis";
import MongoDB from "./lib/mongo";

MongoDB.init();
Redis.init();

const server = new Server();
server.listen();

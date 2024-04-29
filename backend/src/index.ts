import Server from "./server";
import MongoDB from "./lib/mongo";

MongoDB.init();

const server = new Server();
server.listen();

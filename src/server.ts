import "@geckos.io/phaser-on-nodejs";
import * as express from "express";
import * as http from "http";
import * as compression from "compression";
import { SERVER_PORT } from "./config/server";
import generateGame from "./util/generateGame";
import geckos, { iceServers, ServerChannel, Data } from "@geckos.io/server";
import { SIGNALS } from "./util/communicationSignals";

const app = express();
app.use(compression());
const server = http.createServer(app);
const channels: { [key: string]: ServerChannel } = {};

const geckosServer = geckos({
  iceServers: process.env.NODE_ENV === "production" ? iceServers : [],
});
geckosServer.addServer(server);
geckosServer.onConnection((channel: ServerChannel) => {
  console.log(`Got a client connection with ID ${channel.id}`);
  channel.emit(SIGNALS.READY, undefined, { reliable: true });
  channel.on(SIGNALS.LOGIN, (data: Data) => {
    if (typeof data === "string") {
      channels[data] = channel;
      console.log(`Authenticated a channel with session ID ${data}`);
    } else {
      console.warn(
        `Unexpected data type found for login message: ${typeof data}`
      );
    }
  });
  generateGame(server);
});

server.listen(SERVER_PORT, () => {
  console.log(`Express is listening on ${SERVER_PORT}`);
});

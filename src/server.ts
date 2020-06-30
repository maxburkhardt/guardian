import "@geckos.io/phaser-on-nodejs";
import * as express from "express";
import * as http from "http";
import * as compression from "compression";
import { SERVER_PORT } from "./config/server";
import generateGame from "./util/generateGame";
import geckos, { iceServers, ServerChannel } from "@geckos.io/server";
import { SIGNALS } from "./util/communicationSignals";
import NetworkedGame from "./extensions/NetworkedGame";

const app = express();
app.use(compression());
const server = http.createServer(app);
const channels: { [key: string]: ServerChannel } = {};
const games: { [key: string]: NetworkedGame } = {};

const geckosServer = geckos({
  iceServers: process.env.NODE_ENV === "production" ? iceServers : [],
  authorization: async (header: string) => {
    return { sessionId: header };
  },
});
geckosServer.addServer(server);
geckosServer.onConnection((channel: ServerChannel) => {
  console.log(
    `Got a client connection with ID ${channel.id}, session ID ${channel.userData.sessionId}`
  );
  channels[channel.userData.sessionId] = channel;
  channel.emit(SIGNALS.READY, undefined, { reliable: true });
  channel.on(SIGNALS.GAME_CREATE, () => {
    const game = generateGame(server);
    games[game.entryCode] = game;
    console.log(`Created game with entry code ${game.entryCode}`);
    channel.join(game.entryCode);
    channel.emit(SIGNALS.ENTER_LOBBY, undefined, { reliable: true });
  });
  channel.on(SIGNALS.GAME_JOIN, (entryCode: string) => {
    channel.join(entryCode);
    channel.emit(SIGNALS.ENTER_LOBBY, undefined, { reliable: true });
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Express is listening on ${SERVER_PORT}`);
});

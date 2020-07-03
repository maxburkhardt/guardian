import "@geckos.io/phaser-on-nodejs";
import * as express from "express";
import * as http from "http";
import * as compression from "compression";
import { SERVER_PORT } from "./config/server";
import generateGame from "./util/generateGame";
import geckos, { iceServers, ServerChannel } from "@geckos.io/server";
import { SIGNALS } from "./util/communicationSignals";

const app = express();
app.use(compression());
const server = http.createServer(app);
const channels: { [key: string]: ServerChannel } = {};
const games: { [key: string]: Phaser.Game } = {};

const geckosServer = geckos({
  iceServers: process.env.NODE_ENV === "production" ? iceServers : [],
  authorization: async (header: string) => {
    return { sessionId: header };
  },
  cors: { allowAuthorization: true, origin: "http://localhost:8080" }
});
geckosServer.addServer(server);
geckosServer.onConnection((channel: ServerChannel) => {
  console.log(
    `Got a client connection with ID ${channel.id}, session ID ${channel.userData.sessionId}`
  );
  channels[channel.userData.sessionId] = channel;
  channel.emit(SIGNALS.READY, undefined, { reliable: true });
  channel.on(SIGNALS.GAME_CREATE, () => {
    // Make the game
    const game = generateGame(server);
    const entryCode = game.registry.get("entryCode");

    // Store the game in our registry of games, by its entry code
    games[entryCode] = game;
    console.log(`Created game with entry code ${entryCode}`);

    // Put this channel into a room for this entry code, for easy broadcasting
    channel.join(entryCode);

    // Tell the game object that this channel is now in it
    const newChannelEntry = {};
    newChannelEntry[channel.userData.sessionId] = channel;
    game.registry.set(
      "channels",
      Object.assign(game.registry.get("channels"), newChannelEntry)
    );

    // Let the client know that they are clear to enter the lobby
    channel.emit(SIGNALS.ENTER_LOBBY, entryCode, { reliable: true });
  });
  channel.on(SIGNALS.GAME_JOIN, (entryCode: string) => {
    console.log(`Got lobby join request with entry code ${entryCode}`);
    if (entryCode in games) {
      // Put this channel into a room for this entry code, for easy broadcasting
      channel.join(entryCode);

      // Tell the game object that this channel is now in it
      const newChannelEntry = {};
      newChannelEntry[channel.userData.sessionId] = channel;
      games[entryCode].registry.set(
        "channels",
        Object.assign(
          games[entryCode].registry.get("channels"),
          newChannelEntry
        )
      );

      // Let the client know that they are clear to enter the lobby
      channel.emit(SIGNALS.ENTER_LOBBY, entryCode, { reliable: true });
    } else {
      console.warn(
        `User requested to join game with entry code ${entryCode}, which was not found.`
      );
    }
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`Express is listening on ${SERVER_PORT}`);
});

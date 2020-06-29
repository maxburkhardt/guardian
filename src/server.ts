import "@geckos.io/phaser-on-nodejs";
import * as Phaser from "phaser";
import * as express from "express";
import * as http from "http";
import * as compression from "compression";
import ServerLobbyScene from "./scenes/ServerLobbyScene";
import NetworkedGame from "./extensions/NetworkedGame";
import { generateNewState } from "./util/StateManagement";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Guardian Server",
  type: Phaser.HEADLESS,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: { default: "arcade" },
  audio: { noAudio: true },
  parent: "game",
  scene: ServerLobbyScene,
};

const app = express();
app.use(compression());
const server = http.createServer(app);
const SERVER_PORT = 9090;
new NetworkedGame(gameConfig, server, generateNewState("DEVMAP2"));

app.get("/", (_, res) => {
  res.json({ hello: "there" });
});

server.listen(SERVER_PORT, () => {
  console.log(`Express is listening on ${SERVER_PORT}`);
});

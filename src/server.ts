import "@geckos.io/phaser-on-nodejs";
import * as Phaser from "phaser";
import * as express from "express";
import * as http from "http";
import * as compression from "compression";
import ServerLobbyScene from "./scenes/ServerLobbyScene";
import NetworkedGame from "./extensions/NetworkedGame";
import { generateNewState, createSnapshot } from "./util/StateManagement";
import { Vault } from "@geckos.io/snapshot-interpolation";
import { SERVER_FPS, SERVER_PORT } from "./config/Server";
import ServerGameScene from "./scenes/ServerGameScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Guardian Server",
  type: Phaser.HEADLESS,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: { default: "arcade" },
  fps: { target: SERVER_FPS }, // TODO tune based on performance needs
  audio: { noAudio: true },
  parent: "game",
  scene: [ServerLobbyScene, ServerGameScene],
};

const app = express();
app.use(compression());
const server = http.createServer(app);
// Make a new game
const newState = generateNewState("DEVMAP2");
const stateVault = new Vault();
const snap = createSnapshot(newState);
stateVault.add(snap);
new NetworkedGame(gameConfig, server, stateVault);

app.get("/", (_, res) => {
  res.json({ hello: "there" });
});

server.listen(SERVER_PORT, () => {
  console.log(`Express is listening on ${SERVER_PORT}`);
});

import "@geckos.io/phaser-on-nodejs";
import * as Phaser from "phaser";
import RobberScene from "./scenes/RobberScene";
import * as express from "express";
import * as http from "http";
import * as compression from "compression";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Guardian Server",

  type: Phaser.HEADLESS,

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },

  audio: { noAudio: true },

  parent: "game",
  backgroundColor: "#000000",
  scene: RobberScene,
};

//export const game = new Phaser.Game(gameConfig);

const app = express();
app.use(compression());
const server = http.createServer(app);
const SERVER_PORT = 9090;

app.get("/", (_, res) => {
  res.json({ hello: "there" });
});

server.listen(SERVER_PORT, () => {
  console.log(`Express is listening on ${SERVER_PORT}`);
});

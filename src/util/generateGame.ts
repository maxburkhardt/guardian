import "@geckos.io/phaser-on-nodejs";
import * as Phaser from "phaser";
import * as nodeCrypto from "crypto";
import * as http from "http";
import ServerLobbyScene from "../scenes/ServerLobbyScene";
import ServerGameScene from "../scenes/ServerGameScene";
import { SERVER_FPS } from "../config/server";
import { generateNewState, createSnapshot } from "./stateManagement";
import { Vault } from "@geckos.io/snapshot-interpolation";

export default function generateGame(server: http.Server): Phaser.Game {
  const newState = generateNewState("DEVMAP2");
  const stateVault = new Vault();
  const snap = createSnapshot(newState);
  stateVault.add(snap);
  const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Guardian Server",
    type: Phaser.HEADLESS,
    customEnvironment: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: { default: "arcade" },
    fps: { target: SERVER_FPS }, // TODO tune based on performance needs
    audio: { noAudio: true },
    parent: "game",
    scene: [ServerLobbyScene, ServerGameScene],
    callbacks: {
      preBoot: (prebootGame: Phaser.Game) => {
        prebootGame.registry.merge({
          server: server,
          stateVault: stateVault,
          entryCode: getRandomGameId(),
          channels: {},
        });
      },
    },
  };
  return new Phaser.Game(gameConfig);
}

function getRandomGameId(): string {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const availableCount = characters.length;
  for (let i = 0; i < 6; i++) {
    const bytes = nodeCrypto.randomBytes(4);
    const num = bytes.readUInt32BE();
    const pct = num / 4294967295;
    result += characters.charAt(Math.floor(availableCount * pct));
  }
  return result;
}

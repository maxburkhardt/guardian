import * as Phaser from "phaser";
import RobberScene from "./scenes/RobberScene";
import TitleScene from "./scenes/TitleScene";
import ConnectScene from "./scenes/ConnectScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Guardian",

  type: Phaser.AUTO,

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

  parent: "game",
  backgroundColor: "#000000",
  scene: [TitleScene, ConnectScene, RobberScene],
};

export const game = new Phaser.Game(gameConfig);

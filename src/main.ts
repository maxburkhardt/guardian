import * as Phaser from "phaser";
import RobberScene from "./scenes/RobberScene"
import TitleScene from "./scenes/TitleScene"

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",

  type: Phaser.AUTO,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1600,
    height: 1600,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },

  parent: "game",
  backgroundColor: "#000000",
  scene: [TitleScene, RobberScene],
};

export const game = new Phaser.Game(gameConfig);

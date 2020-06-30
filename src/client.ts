import * as Phaser from "phaser";
import RobberScene from "./scenes/RobberScene";
import TitleScene from "./scenes/TitleScene";
import ConnectScene from "./scenes/ConnectScene";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

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
  dom: {
    createContainer: true,
  },
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
    ],
  },
  parent: "game",
  backgroundColor: "#000000",
  scene: [ConnectScene, TitleScene, RobberScene],
};

export const game = new Phaser.Game(gameConfig);

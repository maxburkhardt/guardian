import * as Phaser from "phaser";
import { preloadTilemap, createTilemap } from "../util/TilemapUtil";

export type SquareBody = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "RobberScene",
};

export default class RobberScene extends Phaser.Scene {
  private square: SquareBody;

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    preloadTilemap(this, "gentle_forest", "devmap");
  }

  public create(): void {
    createTilemap(this, "devmap", "Gentle Forest", "gentle_forest");
    this.square = this.add.rectangle(400, 400, 50, 50, 0xffffff) as SquareBody;
    this.physics.add.existing(this.square);
  }

  public update(): void {
    const cursorKeys = this.input.keyboard.createCursorKeys();

    if (cursorKeys.up.isDown) {
      this.square.body.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      this.square.body.setVelocityY(500);
    } else {
      this.square.body.setVelocityY(0);
    }

    if (cursorKeys.right.isDown) {
      this.square.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.square.body.setVelocityX(-500);
    } else {
      this.square.body.setVelocityX(0);
    }
  }
}

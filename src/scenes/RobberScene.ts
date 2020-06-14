import * as Phaser from "phaser";
import { preloadTilemap, createTilemap } from "../util/TilemapUtil";
import Robber, { preloadRobbers } from "../entities/Robber";

export default class RobberScene extends Phaser.Scene {
  private robber: Robber;

  constructor() {
    super({ key: "RobberScene" });
  }

  public preload(): void {
    preloadTilemap(this, "gentle_forest", "devmap");
    preloadRobbers(this);
  }

  public create(): void {
    createTilemap(this, "devmap", "Gentle Forest", "gentle_forest");
    this.robber = new Robber(this, 100, 100, "DISCORDIA");
    this.add.existing(this.robber);

    const camera = this.cameras.main;
    camera.startFollow(this.robber);
    camera.setZoom(3);
  }

  public update(): void {
    const cursorKeys = this.input.keyboard.createCursorKeys();

    if (cursorKeys.up.isDown) {
      this.robber.arcadeBody().setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      this.robber.arcadeBody().setVelocityY(500);
    } else {
      this.robber.arcadeBody().setVelocityY(0);
    }

    if (cursorKeys.right.isDown) {
      this.robber.arcadeBody().setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.robber.arcadeBody().setVelocityX(-500);
    } else {
      this.robber.arcadeBody().setVelocityX(0);
    }
  }
}

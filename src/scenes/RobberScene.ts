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
    this.physics.world.setBounds(0, 0, 1600, 1600);
    this.robber = new Robber(this, 800, 800, "DISCORDIA");
    this.add.existing(this.robber);

    const camera = this.cameras.main;
    camera.startFollow(this.robber);
    camera.setZoom(3);
  }

  public update(): void {
    const cursorKeys = this.input.keyboard.createCursorKeys();
    let horzMovement = true;
    let vertMovement = true;

    if (cursorKeys.up.isDown) {
      this.robber.moveUp();
    } else if (cursorKeys.down.isDown) {
      this.robber.moveDown();
    } else {
      vertMovement = false;
    }

    if (cursorKeys.right.isDown) {
      this.robber.moveRight();
    } else if (cursorKeys.left.isDown) {
      this.robber.moveLeft();
    } else {
      horzMovement = false;
    }

    if (!horzMovement && !vertMovement) {
      this.robber.idle();
    }
  }
}

import * as Phaser from "phaser";
import { preloadTilemap, createTilemap } from "../util/TilemapUtil";
import Robber, { preloadRobbers } from "../entities/Robber";
import Guardian, { preloadGuardians } from "../entities/Guardian";

export default class RobberScene extends Phaser.Scene {
  private robber: Robber;
  private guardian1: Guardian;

  constructor() {
    super({ key: "RobberScene" });
  }

  public preload(): void {
    preloadTilemap(this, "gentle_forest", "devmap2");
    preloadRobbers(this);
    preloadGuardians(this);
  }

  public create(): void {
    const mapData = createTilemap(
      this,
      "devmap2",
      "Gentle Forest",
      "gentle_forest"
    );
    this.physics.world.setBounds(0, 0, 800, 800);
    this.robber = new Robber(
      this,
      400,
      400,
      "DISCORDIA",
      mapData.collideableLayers
    );
    this.guardian1 = new Guardian(
      this, 200, 200, "YZAZAMAEL", mapData.collideableLayers
    );

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

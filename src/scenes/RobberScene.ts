import * as Phaser from "phaser";
import {
  preloadTilemap,
  createTilemap,
  MapInfo,
  getMapInfo,
} from "../util/TilemapUtil";
import Robber, { preloadRobbers } from "../entities/Robber";
import Guardian, { preloadGuardians } from "../entities/Guardian";
import { ClientChannel } from "@geckos.io/client";
import { GameState } from "../util/StateManagement";

export type SceneArgs = {
  channel: ClientChannel;
  gameState: GameState;
};

export default class RobberScene extends Phaser.Scene {
  private robber: Robber;
  private guardian1: Guardian;
  private channel: ClientChannel;
  private gameState: GameState;
  private mapInfo: MapInfo;

  constructor() {
    super({ key: "RobberScene" });
  }

  public init(args: SceneArgs): void {
    this.channel = args.channel;
    this.gameState = args.gameState;
    this.mapInfo = getMapInfo(this.gameState.gameData[0].mapName.trim());
  }

  public preload(): void {
    preloadTilemap(this, this.mapInfo.tilesetName, this.mapInfo.name);
    preloadRobbers(this);
    preloadGuardians(this);
  }

  public create(): void {
    const mapData = createTilemap(this, this.mapInfo);
    this.physics.world.setBounds(0, 0, this.mapInfo.width, this.mapInfo.height);
    this.robber = new Robber(
      this,
      400,
      400,
      "DISCORDIA",
      mapData.collideableLayers
    );
    this.guardian1 = new Guardian(
      this,
      200,
      200,
      "YZAZAMAEL",
      mapData.collideableLayers
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

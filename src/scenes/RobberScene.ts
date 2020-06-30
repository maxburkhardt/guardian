import * as Phaser from "phaser";
import {
  preloadTilemap,
  createTilemap,
  MapInfo,
  getMapInfo,
} from "../util/tilemapUtil";
import Robber, { preloadRobbers } from "../entities/Robber";
import Guardian, { preloadGuardians } from "../entities/Guardian";
import { ClientChannel } from "@geckos.io/client";
import { decompressSnapshot } from "../util/stateManagement";
import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import { SERVER_FPS } from "../config/server";

export type SceneArgs = {
  channel: ClientChannel;
  mapName: string;
};

export default class RobberScene extends Phaser.Scene {
  private robber: Robber;
  private channel: ClientChannel;
  private mapInfo: MapInfo;
  private SI: SnapshotInterpolation;

  constructor() {
    super({ key: "RobberScene" });
  }

  public init(args: SceneArgs): void {
    this.channel = args.channel;
    this.SI = new SnapshotInterpolation(SERVER_FPS);
    this.mapInfo = getMapInfo(args.mapName);
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
    new Guardian(this, 200, 200, "YZAZAMAEL", mapData.collideableLayers);

    // Set up camera
    const camera = this.cameras.main;
    camera.startFollow(this.robber);
    camera.setZoom(3);

    // Configure callbacks for server communication
    this.channel.onRaw((data: ArrayBuffer) =>
      this.handleNewSnapshot(this.SI, data)
    );
  }

  public update(): void {
    // Compute values based on snapshot interpolation

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

  private handleNewSnapshot(
    SI: SnapshotInterpolation,
    data: ArrayBuffer
  ): void {
    SI.snapshot.add(decompressSnapshot(data));
  }
}

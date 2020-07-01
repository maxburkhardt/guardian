import { compressSnapshot } from "../util/stateManagement";
import {
  MapInfo,
  getMapInfo,
  preloadTilemap,
  createTilemap,
} from "../util/tilemapUtil";
import Robber, { preloadRobbers } from "../entities/Robber";
import Guardian, { preloadGuardians } from "../entities/Guardian";
import { CharacterChoices } from "./ServerLobbyScene";
import { ServerChannel } from "@geckos.io/server";

export type GameConfiguration = {
  mapName: string;
  characterChoices: CharacterChoices;
};

export default class ServerGameScene extends Phaser.Scene {
  private mapInfo: MapInfo;
  private characterChoices: CharacterChoices;
  private guardians: Array<Guardian>;
  private robbers: Array<Robber>;

  constructor() {
    super({ key: "ServerGameScene" });
  }

  public init(config: GameConfiguration): void {
    this.mapInfo = getMapInfo(config.mapName);
    this.characterChoices = config.characterChoices;
    this.guardians = [];
    this.robbers = [];
  }

  public preload(): void {
    preloadTilemap(this, this.mapInfo.tilesetName, this.mapInfo.name);
    preloadRobbers(this);
    preloadGuardians(this);
    console.log(
      `Server game scene preloaded for game ${this.sys.registry.get(
        "entryCode"
      )}`
    );
  }

  public create(): void {
    const mapData = createTilemap(this, this.mapInfo);
    this.physics.world.setBounds(0, 0, this.mapInfo.width, this.mapInfo.height);
    for (const [, { type, name }] of Object.entries(this.characterChoices)) {
      if (type === "robber") {
        this.robbers.push(
          new Robber(this, 400, 400, name, mapData.collideableLayers)
        );
      } else if (type === "guardian") {
        this.guardians.push(
          new Guardian(this, 400, 400, name, mapData.collideableLayers)
        );
      } else {
        throw new Error(`Invalid character type supplied: ${type}`);
      }
    }
  }

  public update(): void {
    const channel = Object.values(
      this.sys.registry.get("channels")
    )[0] as ServerChannel;
    channel.raw.room.emit(
      compressSnapshot(this.sys.registry.get("stateVault").get())
    );
  }
}

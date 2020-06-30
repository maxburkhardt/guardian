import NetworkedScene from "../extensions/NetworkedScene";
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

export type GameConfiguration = {
  mapName: string;
  characterChoices: CharacterChoices;
};

export default class ServerGameScene extends NetworkedScene {
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
    for (const [, channel] of Object.entries(this.game.channels)) {
      channel.raw.emit(compressSnapshot(this.game.stateVault.get()));
    }
  }
}

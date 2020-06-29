import * as http from "http";
import { Vault } from "@geckos.io/snapshot-interpolation";
import { ServerChannel } from "@geckos.io/server";

export default class NetworkedGame extends Phaser.Game {
  public server: http.Server;
  public stateVault: Vault;
  public channels: { [key: string]: ServerChannel };
  public gameId: string;

  constructor(
    config: Phaser.Types.Core.GameConfig,
    server: http.Server,
    stateVault: Vault
  ) {
    super(config);
    this.server = server;
    this.stateVault = stateVault;
    this.channels = {};
    // TODO randomly generate
    this.gameId = "TEST";
  }
}

import * as http from "http";
import { ClientChannel } from "@geckos.io/client";
import { Vault } from "@geckos.io/snapshot-interpolation";

export default class NetworkedGame extends Phaser.Game {
  public server: http.Server;
  public stateVault: Vault;
  public channels: { [key: string]: ClientChannel };

  constructor(
    config: Phaser.Types.Core.GameConfig,
    server: http.Server,
    stateVault: Vault
  ) {
    super(config);
    this.server = server;
    this.stateVault = stateVault;
    this.channels = {};
  }
}

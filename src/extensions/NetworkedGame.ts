import * as http from "http";
import { GameState } from "../util/StateManagement";

export default class NetworkedGame extends Phaser.Game {
  public server: http.Server;
  public state: GameState;

  constructor(
    config: Phaser.Types.Core.GameConfig,
    server: http.Server,
    state: GameState
  ) {
    super(config);
    this.server = server;
    this.state = state;
  }
}

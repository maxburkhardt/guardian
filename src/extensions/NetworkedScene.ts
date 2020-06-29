import NetworkedGame from "./NetworkedGame";

export default class NetworkedScene extends Phaser.Scene {
  public game = this.game as NetworkedGame;
  public state = this.game.state;
}

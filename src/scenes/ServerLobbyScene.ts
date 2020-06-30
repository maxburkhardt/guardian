import { ServerChannel } from "@geckos.io/server";
import NetworkedScene from "../extensions/NetworkedScene";

export type CharacterChoices = {
  [key: string]: { type: string; name: string };
};

export type LobbyArgs = {
  channel: ServerChannel;
};

export default class ServerLobbyScene extends NetworkedScene {
  private mapChoice: string;
  private characterChoices: CharacterChoices;
  private channel: ServerChannel;

  constructor() {
    super({ key: "ServerLobbyScene" });
  }

  public init(args: LobbyArgs): void {
    // TODO: this is all hardcoded for now, will eventually be selectable
    this.mapChoice = "DEVMAP2";
    this.characterChoices = { foobar: { type: "robber", name: "DISCORDIA" } };
    this.channel = args.channel;
  }

  public create(): void {
    //this.channel.join(this.game.gameId);
    /*
    this.channel.on(SIGNALS.GAME_START_REQUEST, () => {
      console.log(`Received game start request from session ${sessionId}`);
      //this.channel.room.emit(SIGNALS.GAME_START_NOTIFICATION, this.mapChoice);
    });
      */
    this.scene.start("ServerGameScene", {
      mapName: this.mapChoice,
      characterChoices: this.characterChoices,
    });
  }
}

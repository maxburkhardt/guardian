import { ServerChannel } from "@geckos.io/server";
import { SIGNALS } from "../util/communicationSignals";

export type CharacterChoices = {
  [key: string]: { type: string; name: string };
};

export default class ServerLobbyScene extends Phaser.Scene {
  private mapChoice: string;
  private characterChoices: CharacterChoices;
  private channel: ServerChannel;

  constructor() {
    super({ key: "ServerLobbyScene" });
  }

  public init(): void {
    // TODO: this is all hardcoded for now, will eventually be selectable
    this.mapChoice = "DEVMAP2";
    this.characterChoices = { foobar: { type: "robber", name: "DISCORDIA" } };
  }

  public create(): void {
    this.sys.registry.events.on("changedata", () => {
      for (const [, channel] of Object.entries(
        this.sys.registry.get("channels")
      ) as Array<[string, ServerChannel]>) {
        channel.on(SIGNALS.GAME_START_REQUEST, () => {
          console.log(
            `Received game start request from session ${channel.userData.sessionId}`
          );
          channel.room.emit(SIGNALS.GAME_START_NOTIFICATION, this.mapChoice);
          this.scene.start("ServerGameScene", {
            mapName: this.mapChoice,
            characterChoices: this.characterChoices,
          });
        });
      }
    });
  }
}

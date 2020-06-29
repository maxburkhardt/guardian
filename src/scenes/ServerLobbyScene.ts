import geckos, {
  iceServers,
  GeckosServer,
  ServerChannel,
} from "@geckos.io/server";
import NetworkedScene from "../extensions/NetworkedScene";
import { SIGNALS } from "../util/CommunicationSignals";
import { Data } from "@geckos.io/client";

export type CharacterChoices = {
  [key: string]: { type: string; name: string };
};

export default class ServerLobbyScene extends NetworkedScene {
  private geckosServer: GeckosServer;
  private mapChoice: string;
  private characterChoices: CharacterChoices;

  constructor() {
    super({ key: "ServerLobbyScene" });
  }

  public init(): void {
    this.geckosServer = geckos({
      iceServers: process.env.NODE_ENV === "production" ? iceServers : [],
    });
    this.geckosServer.addServer(this.game.server);
    // TODO: this is all hardcoded for now, will eventually be selectable
    this.mapChoice = "DEVMAP2";
    this.characterChoices = { foobar: { type: "robber", name: "DISCORDIA" } };
  }

  public create(): void {
    this.geckosServer.onConnection((channel: ServerChannel) => {
      console.log(`Got a client connection with ID ${channel.id}`);
      let sessionId: string | undefined = undefined;
      channel.join(this.game.gameId);
      channel.emit(SIGNALS.READY, undefined, { reliable: true });
      channel.on(SIGNALS.LOGIN, (data: Data) => {
        if (typeof data === "string") {
          this.game.channels[data] = channel;
          sessionId = data;
          console.log(`Authenticated a channel with session ID ${data}`);
        } else {
          console.warn(
            `Unexpected data type found for login message: ${typeof data}`
          );
        }
      });
      channel.on(SIGNALS.GAME_START_REQUEST, () => {
        console.log(`Received game start request from session ${sessionId}`);
        channel.room.emit(SIGNALS.GAME_START_NOTIFICATION, this.mapChoice);
        this.scene.start("ServerGameScene", {
          mapName: this.mapChoice,
          characterChoices: this.characterChoices,
        });
      });
    });
  }
}

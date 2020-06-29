import geckos, { iceServers, GeckosServer } from "@geckos.io/server";
import NetworkedScene from "../extensions/NetworkedScene";
import { SIGNALS } from "../util/CommunicationSignals";
import { ClientChannel, Data } from "@geckos.io/client";
import { compressSnapshot } from "../util/StateManagement";

export default class ServerScene extends NetworkedScene {
  private geckosServer: GeckosServer;

  constructor() {
    super({ key: "ServerLobbyScene" });
  }

  public init(): void {
    this.geckosServer = geckos({
      iceServers: process.env.NODE_ENV === "production" ? iceServers : [],
    });
    this.geckosServer.addServer(this.game.server);
  }

  public create(): void {
    this.geckosServer.onConnection((channel: ClientChannel) => {
      console.log(`Got a client connection with ID ${channel.id}`);
      channel.emit(SIGNALS.READY);
      channel.on(SIGNALS.LOGIN, (data: Data) => {
        if (typeof data === "string") {
          this.game.channels[data] = channel;
          console.log(`Authenticated a channel with session ID ${data}`);
          channel.raw.emit(compressSnapshot(this.game.stateVault.get()));
        } else {
          console.warn(
            `Unexpected data type found for login message: ${typeof data}`
          );
        }
      });
    });
  }
}

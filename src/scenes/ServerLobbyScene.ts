import geckos, { iceServers, GeckosServer } from "@geckos.io/server";
import NetworkedScene from "../extensions/NetworkedScene";

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
    this.geckosServer.onConnection((channel) => {
      channel.emit("ready");
    });
  }
}

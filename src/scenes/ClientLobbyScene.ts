import * as Phaser from "phaser";
import { ClientChannel } from "@geckos.io/client";
import {
  titleStyle,
  getPointRelativeToView,
  buttonStyle,
} from "../util/sceneUtil";

export type ClientLobbySceneArgs = {
  channel: ClientChannel;
  entryCode: string;
};

export default class ClientLobbyScene extends Phaser.Scene {
  private channel: ClientChannel;
  private entryCode: string;
  private headerText: Phaser.GameObjects.Text;
  private entryCodeText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "ClientLobbyScene" });
  }

  private positionElements(scene: Phaser.Scene): () => void {
    return (): void => {
      this.headerText.setPosition(...getPointRelativeToView(scene, 0.5, 0.1));
      this.entryCodeText.setPosition(
        ...getPointRelativeToView(scene, 0.5, 0.2)
      );
    };
  }

  public init(args: ClientLobbySceneArgs): void {
    this.channel = args.channel;
    this.entryCode = args.entryCode;
  }

  public create(): void {
    this.headerText = this.add
      .text(0, 0, "Guardian Lobby", titleStyle)
      .setOrigin(0.5);
    this.entryCodeText = this.add
      .text(0, 0, `Entry Code: ${this.entryCode}`, buttonStyle)
      .setOrigin(0.5);
    this.positionElements(this)();
    this.scale.on("resize", this.positionElements(this));
  }
}

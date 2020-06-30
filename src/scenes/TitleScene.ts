import * as Phaser from "phaser";
import WebFontFile from "../util/WebFontFile";
import {
  getPointRelativeToView,
  titleStyle,
  buttonStyle,
} from "../util/sceneUtil";
import { ClientChannel } from "@geckos.io/client";
import { SIGNALS } from "../util/communicationSignals";

export type TitleSceneArgs = {
  channel: ClientChannel;
};

export default class TitleScene extends Phaser.Scene {
  private titleText: Phaser.GameObjects.Text;
  private newGameText: Phaser.GameObjects.Text;
  private entryCodeInput: Phaser.GameObjects.Text;
  private entryCodeBox: Phaser.GameObjects.Rectangle;
  private joinText: Phaser.GameObjects.Text;
  private channel: ClientChannel;

  constructor() {
    super({ key: "TitleScene" });
  }

  public init(args: TitleSceneArgs): void {
    this.channel = args.channel;
  }

  public preload(): void {
    this.load.addFile(new WebFontFile(this.load, "Metamorphous"));
  }

  private positionElements(scene: Phaser.Scene): () => void {
    return (): void => {
      this.titleText.setPosition(...getPointRelativeToView(scene, 0.5, 0.3));
      this.newGameText.setPosition(...getPointRelativeToView(scene, 0.5, 0.5));
      this.entryCodeInput.setPosition(
        ...getPointRelativeToView(scene, 0.5, 0.6)
      );
      this.entryCodeBox.setPosition(
        this.entryCodeInput.getTopLeft().x,
        this.entryCodeInput.getTopLeft().y
      );
      this.entryCodeBox.setSize(
        this.entryCodeInput.width,
        this.entryCodeInput.height
      );
      this.joinText.setPosition(...getPointRelativeToView(scene, 0.5, 0.65));
    };
  }

  public create(): void {
    this.titleText = this.add
      .text(0, 0, "Guardians", titleStyle)
      .setOrigin(0.5);
    this.newGameText = this.add
      .text(0, 0, "New Game", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.newGameText.setStyle({ fill: "#7AF5FF" });
      })
      .on("pointerout", () => {
        this.newGameText.setStyle({ fill: "#fff" });
      })
      .on("pointerup", () => {
        this.channel.emit(SIGNALS.GAME_CREATE, undefined, { reliable: true });
        this.channel.on(SIGNALS.ENTER_LOBBY, (entryCode: string) => {
          this.transitionToLobby(entryCode);
        });
      });
    this.entryCodeBox = this.add.rectangle(0, 0, 0, 0, 0x666666);
    this.entryCodeInput = this.add
      .text(0, 0, "enter entry code", buttonStyle)
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerup", () => {
        this["rexUI"].edit(this.entryCodeInput);
      });
    this.joinText = this.add
      .text(0, 0, "Join", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.joinText.setStyle({ fill: "#7AF5FF" });
      })
      .on("pointerout", () => {
        this.joinText.setStyle({ fill: "#fff" });
      })
      .on("pointerup", () => {
        this.channel.emit(SIGNALS.GAME_JOIN, this.entryCodeInput.text, {
          reliable: true,
        });
        this.channel.on(SIGNALS.ENTER_LOBBY, (entryCode: string) => {
          this.transitionToLobby(entryCode);
        });
      });
    this.positionElements(this)();
    this.scale.on("resize", this.positionElements(this));
  }

  private transitionToLobby(entryCode: string): void {
    this.scale.removeAllListeners();
    this.scene.start("ClientLobbyScene", {
      channel: this.channel,
      entryCode: entryCode,
    });
  }
}

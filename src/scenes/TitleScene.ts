import * as Phaser from "phaser";
import InputUtil from "../util/InputUtil";
import WebFontFile from "../util/WebFontFile";
import { getPointRelativeToView } from "../util/sceneUtil";
import { ClientChannel } from "@geckos.io/client";
import { SIGNALS } from "../util/communicationSignals";

export type TitleSceneArgs = {
  channel: ClientChannel;
};

export default class TitleScene extends Phaser.Scene {
  private inputUtil: InputUtil;
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
    this.inputUtil = new InputUtil(this);
    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Metamorphous",
      fontSize: "64px",
      color: "#fff",
      align: "center",
    };
    const buttonStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Metamorphous",
      fontSize: "36px",
      color: "#fff",
      align: "center",
    };
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
      });
    this.positionElements(this)();
    this.scale.on("resize", this.positionElements(this));
  }
}

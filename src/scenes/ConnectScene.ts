import * as Phaser from "phaser";
import WebFontFile from "../util/WebFontFile";
import geckos, { ClientChannel } from "@geckos.io/client";
import { getCameraCenter } from "../util/SceneUtil";
import { SIGNALS } from "../util/CommunicationSignals";
import { SERVER_PORT } from "../config/Server";
import InputUtil from "../util/InputUtil";

export default class ConnectScene extends Phaser.Scene {
  private text: Phaser.GameObjects.Text;
  private inputUtil: InputUtil;
  private channel: ClientChannel;
  private connected: boolean;

  constructor() {
    super({ key: "ConnectScene" });
    this.connected = false;
  }

  public preload(): void {
    this.load.addFile(new WebFontFile(this.load, "Metamorphous"));
  }

  private recenter(scene: Phaser.Scene): () => void {
    return (): void => {
      const center = getCameraCenter(scene);
      this.text.setX(center[0]);
      this.text.setY(center[1]);
    };
  }

  public create(): void {
    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Metamorphous",
      fontSize: "64px",
      color: "#fff",
      align: "center",
    };
    const center = getCameraCenter(this);
    this.text = this.add
      .text(center[0], center[1], "Connecting...", titleStyle)
      .setOrigin(0.5);
    this.scale.on("resize", this.recenter(this));
    this.inputUtil = new InputUtil(this);

    // Set up communications
    this.channel = geckos({ port: SERVER_PORT });
    this.channel.onConnect((error) => {
      if (error) {
        console.error(error.message);
      }
      this.channel.on(SIGNALS.READY, () => {
        console.log("Successfully established connection with server.");
        this.channel.emit(SIGNALS.LOGIN, "foobar", { reliable: true });
        this.text.setText("Connected!");
        this.connected = true;
      });
    });
  }

  public update(): void {
    if (this.inputUtil.continueIsDown() && this.connected) {
      this.channel.on(SIGNALS.GAME_START_NOTIFICATION, (data: string) => {
        this.scene.start("RobberScene", {
          channel: this.channel,
          mapName: data,
        });
      });
      this.channel.emit(SIGNALS.GAME_START_REQUEST);
    }
  }
}

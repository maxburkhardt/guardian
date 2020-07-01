import * as Phaser from "phaser";
import WebFontFile from "../util/WebFontFile";
import geckos, { ClientChannel } from "@geckos.io/client";
import { getCameraCenter } from "../util/sceneUtil";
import { SIGNALS } from "../util/communicationSignals";
import { SERVER_PORT } from "../config/server";

export default class ConnectScene extends Phaser.Scene {
  private text: Phaser.GameObjects.Text;
  private channel: ClientChannel;

  constructor() {
    super({ key: "ConnectScene" });
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

    // Set up communications
    this.channel = geckos({ port: SERVER_PORT, authorization: "foobar" });
    this.channel.onConnect((error: Error) => {
      if (error) {
        console.error(error.message);
      }
      this.channel.on(SIGNALS.READY, () => {
        console.log("Successfully established connection with server.");
        this.scale.removeAllListeners();
        this.scene.start("TitleScene", {
          channel: this.channel,
        });
      });
    });
  }
}

import * as Phaser from "phaser";
import WebFontFile from "../util/WebFontFile";
import geckos from "@geckos.io/client";
import { getCameraCenter } from "../util/SceneUtil";

export default class TitleScene extends Phaser.Scene {
  private text: Phaser.GameObjects.Text;

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
    const channel = geckos({ port: 9090 });
    channel.onConnect((error) => {
      if (error) {
        console.error(error.message);
      }
      channel.on("ready", () => {
        this.scene.start("RobberScene", { channel: channel });
      });
    });
  }
}

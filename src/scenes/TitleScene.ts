import * as Phaser from "phaser";
import InputUtil from "../util/InputUtil";
import WebFontFile from "../util/WebFontFile";

export default class TitleScene extends Phaser.Scene {
  private inputUtil: InputUtil;
  private text: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "TitleScene" });
  }

  public preload(): void {
    this.load.addFile(new WebFontFile(this.load, "Metamorphous"));
  }

  static getCameraCenter(scene: Phaser.Scene): [number, number] {
    const xCenter =
      scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const yCenter =
      scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    return [xCenter, yCenter];
  }

  private recenter(scene: Phaser.Scene): () => void {
    return (): void => {
      const center = TitleScene.getCameraCenter(scene);
      this.text.setX(center[0]);
      this.text.setY(center[1]);
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
    const center = TitleScene.getCameraCenter(this);
    this.text = this.add
      .text(center[0], center[1], "Guardians", titleStyle)
      .setOrigin(0.5);
    this.scale.on("resize", this.recenter(this));
  }

  public update(): void {
    if (this.inputUtil.continueIsDown()) {
      this.scene.transition({ target: "RobberScene" });
    }
  }
}

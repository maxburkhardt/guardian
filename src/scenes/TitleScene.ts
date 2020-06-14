import * as Phaser from "phaser";
import InputUtil from "../util/InputUtil";

export default class TitleScene extends Phaser.Scene {
  private inputUtil: InputUtil;

  constructor() {
    super({ key: "TitleScene" });
  }

  public create(): void {
    this.inputUtil = new InputUtil(this);
    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "64px",
      color: "#fff",
    };
    const title = new Phaser.GameObjects.Text(
      this,
      100,
      100,
      "Guardians",
      titleStyle
    );
    this.add.existing(title);
  }

  public update(): void {
    if (this.inputUtil.continueIsDown()) {
      this.scene.transition({ target: "RobberScene" });
    }
  }
}

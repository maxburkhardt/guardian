import * as Phaser from "phaser";

export default class InputUtil {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene) {
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
  }

  public continueIsDown(): boolean {
    return this.cursorKeys.space.isDown;
  }
}

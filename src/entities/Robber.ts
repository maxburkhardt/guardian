import * as Phaser from "phaser";

export const ROBBER_SPRITE_KEYS = {
  DISCORDIA: "robber_discordia",
};

export function preloadRobbers(scene: Phaser.Scene): void {
  scene.load.image(
    ROBBER_SPRITE_KEYS.DISCORDIA,
    "/guardian-assets/dev/robbers/Archdemon_Female/idle_1.png"
  );
}

export default class Robber extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, identity: string) {
    super(scene, x, y, ROBBER_SPRITE_KEYS[identity]);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  public arcadeBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}

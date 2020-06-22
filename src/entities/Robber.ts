import * as Phaser from "phaser";

export const ROBBER_SPRITE_KEYS = {
  DISCORDIA: "robber_discordia",
};

export function preloadRobbers(scene: Phaser.Scene): void {
  scene.load.multiatlas(
    ROBBER_SPRITE_KEYS.DISCORDIA,
    "/guardian-assets/dist/characters/discordia.json",
    "/guardian-assets/dist/characters"
  );
}

export default class Robber extends Phaser.Physics.Arcade.Sprite {
  private identity: string;

  constructor(scene: Phaser.Scene, x: number, y: number, identity: string) {
    super(scene, x, y, ROBBER_SPRITE_KEYS[identity], "idle_1.png");
    this.identity = ROBBER_SPRITE_KEYS[identity];
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.createAnimations(scene);
    this.playIdle();
  }

  public arcadeBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  public playRunLeft(): void {
    this.anims.play(`${this.identity}_run_left`, true);
  }

  public playRunRight(): void {
    this.anims.play(`${this.identity}_run_right`, true);
  }

  public playIdle(): void {
    this.anims.play(`${this.identity}_idle`, true);
  }

  private createAnimations(scene: Phaser.Scene): void {
    // Running animations
    const runLeftFrames = scene.anims.generateFrameNames(this.identity, {
      start: 1,
      end: 4,
      prefix: "run_",
      suffix: ".png",
    });
    scene.anims.create({
      key: `${this.identity}_run_left`,
      frames: runLeftFrames,
      frameRate: 20,
      repeat: -1,
    });
    const runRightFrames = scene.anims.generateFrameNames(this.identity, {
      start: 5,
      end: 8,
      prefix: "run_",
      suffix: ".png",
    });
    scene.anims.create({
      key: `${this.identity}_run_right`,
      frames: runRightFrames,
      frameRate: 20,
      repeat: -1,
    });
    // Idle animation
    const idleFrames = scene.anims.generateFrameNames(this.identity, {
      start: 1,
      end: 2,
      prefix: "idle_",
      suffix: ".png",
    });
    scene.anims.create({
      key: `${this.identity}_idle`,
      frames: idleFrames,
      frameRate: 5,
      repeat: -1,
    });
  }
}

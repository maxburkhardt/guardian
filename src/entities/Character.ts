import * as Phaser from "phaser";

export default class Character extends Phaser.Physics.Arcade.Sprite {
  protected identity: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    identity: string,
    spriteKeyMap: { [key: string]: string },
    collideableLayers: Array<Phaser.Tilemaps.StaticTilemapLayer>
  ) {
    super(scene, x, y, spriteKeyMap[identity], "idle_1.png");
    this.identity = spriteKeyMap[identity];
    scene.physics.add.existing(this);
    //this.setSize(44, 20);
    this.body.setCircle(15, 42, 35);
    //this.body.setOffset(30, 40);
    this.setCollideWorldBounds(true);
    for (const layer of collideableLayers) {
      scene.physics.add.collider(this, layer);
    }
    this.createAnimations(scene);
    this.playIdle();
    scene.add.existing(this);
  }

  public arcadeBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  public moveLeft(): void {
    this.arcadeBody().setVelocityX(-500);
    //this.playRunLeft();
  }

  public moveRight(): void {
    this.arcadeBody().setVelocityX(500);
    //this.playRunRight();
  }

  public moveUp(): void {
    this.arcadeBody().setVelocityY(-500);
  }

  public moveDown(): void {
    this.arcadeBody().setVelocityY(500);
  }

  public idle(): void {
    this.arcadeBody().setVelocity(0, 0);
    this.playIdle();
  }

  private playRunLeft(): void {
    this.anims.play(`${this.identity}_run_left`, true);
  }

  private playRunRight(): void {
    this.anims.play(`${this.identity}_run_right`, true);
  }

  private playIdle(): void {
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

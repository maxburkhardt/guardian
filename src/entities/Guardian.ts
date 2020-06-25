import * as Phaser from "phaser";
import Character from "./Character";

export const GUARDIAN_SPRITE_KEYS = {
  YZAZAMAEL: "guardian_yzazamael",
};

export function preloadGuardians(scene: Phaser.Scene): void {
  scene.load.multiatlas(
    GUARDIAN_SPRITE_KEYS.YZAZAMAEL,
    "/guardian-assets/dist/characters/yzazamael.json",
    "/guardian-assets/dist/characters"
  );
}

export default class Guardian extends Character {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    identity: string,
    collideableLayers: Array<Phaser.Tilemaps.StaticTilemapLayer>
  ) {
    super(scene, x, y, identity, GUARDIAN_SPRITE_KEYS, collideableLayers);
  }
}

import * as Phaser from "phaser";
import Character from "./Character";
import { getAssetPath } from "../util/AssetFinder";

export const GUARDIAN_SPRITE_KEYS = {
  YZAZAMAEL: "guardian_yzazamael",
};

export function preloadGuardians(scene: Phaser.Scene): void {
  scene.load.multiatlas(
    GUARDIAN_SPRITE_KEYS.YZAZAMAEL,
    getAssetPath("SPRITESHEET_YZAZAMAEL"),
    getAssetPath("DIRECTORY_CHARACTERS")
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

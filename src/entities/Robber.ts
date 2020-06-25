import * as Phaser from "phaser";
import Character from "./Character";

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

export default class Robber extends Character {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    identity: string,
    collideableLayers: Array<Phaser.Tilemaps.StaticTilemapLayer>
  ) {
    super(scene, x, y, identity, ROBBER_SPRITE_KEYS, collideableLayers);
  }
}

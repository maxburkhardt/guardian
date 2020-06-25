import * as Phaser from "phaser";

export type TilemapData = {
  map: Phaser.Tilemaps.Tilemap;
  collideableLayers: Array<Phaser.Tilemaps.StaticTilemapLayer>;
};

export function preloadTilemap(
  scene: Phaser.Scene,
  tilesetName: string,
  mapName: string
): void {
  scene.load.image(
    generateTilesetKey(tilesetName),
    `/guardian-assets/dist/environment/${tilesetName}.png`
  );
  scene.load.tilemapTiledJSON(
    generateTilemapKey(mapName),
    `/guardian-assets/dist/maps/${mapName}.json`
  );
}

export function createTilemap(
  scene: Phaser.Scene,
  mapName: string,
  tiledTilesetName: string,
  loadedTilesetName: string
): TilemapData {
  const map = scene.make.tilemap({ key: generateTilemapKey(mapName) });
  const tileset = map.addTilesetImage(
    tiledTilesetName,
    generateTilesetKey(loadedTilesetName),
    16,
    16
  );
  map.createStaticLayer("Ground", tileset);
  const cliffs = map.createStaticLayer("Cliffs", tileset);
  cliffs.setCollisionBetween(0, cliffs.tilesTotal, true);
  const trees = map.createStaticLayer("Trees", tileset);
  trees.setCollisionBetween(0, cliffs.tilesTotal, true);
  return {
    map: map,
    collideableLayers: [cliffs, trees],
  };
}

function generateTilesetKey(name: string): string {
  return `${name}_tiles`;
}

function generateTilemapKey(name: string): string {
  return `${name}_map`;
}

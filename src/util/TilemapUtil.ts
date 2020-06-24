import * as Phaser from "phaser";

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
): Phaser.Tilemaps.Tilemap {
  const map = scene.make.tilemap({ key: generateTilemapKey(mapName) });
  const tileset = map.addTilesetImage(
    tiledTilesetName,
    generateTilesetKey(loadedTilesetName),
    16,
    16
  );
  map.createStaticLayer("Ground", tileset);
  map.createStaticLayer("Cliffs", tileset);
  map.createStaticLayer("Trees", tileset);
  return map;
}

function generateTilesetKey(name: string): string {
  return `${name}_tiles`;
}

function generateTilemapKey(name: string): string {
  return `${name}_map`;
}

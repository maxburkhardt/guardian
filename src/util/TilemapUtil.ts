import * as Phaser from "phaser";
import { getAssetPath } from "./AssetFinder";

const MAP_DATA: { [key: string]: MapInfo } = {
  DEVMAP2: {
    name: "DEVMAP2",
    totalItems: 5,
    width: 800,
    height: 800,
    tilesetName: "GENTLE_FOREST",
    tiledTilesetName: "Gentle Forest",
  },
};

export type TilemapData = {
  map: Phaser.Tilemaps.Tilemap;
  collideableLayers: Array<Phaser.Tilemaps.StaticTilemapLayer>;
};

export type MapInfo = {
  name: string;
  totalItems: number;
  width: number;
  height: number;
  tilesetName: string;
  tiledTilesetName: string;
};

export function preloadTilemap(
  scene: Phaser.Scene,
  tilesetName: string,
  mapName: string
): void {
  scene.load.image(
    generateTilesetKey(tilesetName),
    getAssetPath(`TILESET_${tilesetName}`)
  );
  scene.load.tilemapTiledJSON(
    generateTilemapKey(mapName),
    getAssetPath(`MAP_${mapName}`)
  );
}

export function createTilemap(
  scene: Phaser.Scene,
  mapInfo: MapInfo
): TilemapData {
  const map = scene.make.tilemap({ key: generateTilemapKey(mapInfo.name) });
  const tileset = map.addTilesetImage(
    mapInfo.tiledTilesetName,
    generateTilesetKey(mapInfo.tilesetName),
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

export function getMapInfo(mapName: string): MapInfo {
  if (!(mapName in MAP_DATA)) {
    throw new Error(`Map requested not found: ${mapName}`);
  }
  return MAP_DATA[mapName];
}

function generateTilesetKey(name: string): string {
  return `${name}_tiles`;
}

function generateTilemapKey(name: string): string {
  return `${name}_map`;
}

const ASSETS = {
  TILESET_GENTLE_FOREST: "/guardian-assets/dist/environment/gentle_forest.png",
  MAP_DEVMAP2: "/guardian-assets/dist/maps/devmap2.json",
  SPRITESHEET_DISCORDIA: "/guardian-assets/dist/characters/discordia.json",
  SPRITESHEET_YZAZAMAEL: "/guardian-assets/dist/characters/yzazamael.json",
  DIRECTORY_CHARACTERS: "/guardian-assets/dist/characters",
};

export function getAssetPath(name: string): string {
  if (!(name in ASSETS)) {
    throw new Error(`Invalid lookup on asset ${name}`);
  }
  if (typeof process === "object") {
    // This is running in NodeJS, so we should trim the leading '/'
    return "../../../.." + ASSETS[name];
  } else {
    return ASSETS[name];
  }
}

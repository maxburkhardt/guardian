import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import { getMapInfo } from "./TilemapUtil";
import {
  Snapshot,
  State,
  Entity,
} from "@geckos.io/snapshot-interpolation/lib/types";

export type MapInfo = {
  name: string;
  numItems: number;
};

export type CharacterState = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
};

export type RobberState = {
  identity: string;
  invincible: boolean;
  itemsCarried: number;
} & CharacterState;

export type GuardianState = {
  identity: string;
  leaping: boolean;
} & CharacterState;

export type ItemState = {
  x: number;
  y: number;
  heldBy: number; // Index into the robbers array, or -1 if on the ground
  storedBy: number;
};

export type StorageState = {
  x: number;
  y: number;
  opened: boolean;
};

export type GameState = {
  id: number;
  map: MapInfo;
  robbers: Array<RobberState>;
  guardians: Array<GuardianState>;
  robberLives: number;
  storage: Array<StorageState>;
  items: Array<ItemState>;
};

let gameStateCount = 0;
const SI = new SnapshotInterpolation();

export function generateNewState(mapName: string): GameState {
  const thisGameId = gameStateCount;
  gameStateCount += 1;
  return {
    id: thisGameId,
    map: getMapInfo(mapName),
    robbers: [],
    guardians: [],
    robberLives: 3,
    storage: [],
    items: [],
  };
}

export function prepareStateForSnapshot(state: GameState): State {
  const transformed: State = [];
  transformed.push({ id: "id", value: state.id });
  transformed.push({
    id: "map",
    name: state.map.name,
    numItems: state.map.numItems,
  });
  for (let i = 0; i < state.robbers.length; i++) {
    transformed.push(flattenEntity(state.robbers[i], "robber", i));
  }
  for (let i = 0; i < state.guardians.length; i++) {
    transformed.push(flattenEntity(state.guardians[i], "guardian", i));
  }
  transformed.push({ id: "robberLives", value: state.robberLives });
  for (let i = 0; i < state.storage.length; i++) {
    transformed.push(flattenEntity(state.storage[i], "storage", i));
  }
  for (let i = 0; i < state.items.length; i++) {
    transformed.push(flattenEntity(state.items[i], "item", i));
  }
  return transformed;
}

function flattenEntity(
  entity: RobberState | GuardianState | ItemState | StorageState,
  idPrefix: string,
  index: number
): Entity {
  const returnable = {
    id: `${idPrefix}_${index}`,
  };
  for (const [key, value] of Object.entries(entity)) {
    if (typeof value === "number" || typeof value === "string") {
      returnable[key] = value;
    } else {
      returnable[key] = value.toString();
    }
  }
  return returnable;
}

export function createSnapshot(state: GameState): Snapshot {
  return SI.snapshot.create(prepareStateForSnapshot(state));
}

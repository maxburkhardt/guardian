import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import { getMapInfo } from "./tilemapUtil";
import { Snapshot } from "@geckos.io/snapshot-interpolation/lib/types";
import {
  BufferSchema,
  Model,
  string8,
  uint8,
  uint16,
  uint64,
  int16,
  int8,
} from "@geckos.io/typed-array-buffer-schema";
import { SERVER_FPS } from "../config/server";

export type GameData = {
  id: string;
  mapName: string;
  itemsRemaining: number;
  robberLives: number;
  gameId: number;
};

const gameDataSchema = BufferSchema.schema("gameData", {
  id: { type: string8, length: 1 }, // "g"
  mapName: { type: string8, length: 12 },
  itemsRemaining: uint8,
  robberLives: uint8,
  gameId: uint16,
});

export type CharacterState = {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
};

export type RobberState = {
  identity: string;
  invincible: number;
  itemsCarried: number;
} & CharacterState;

const robberStateSchema = BufferSchema.schema("robber", {
  id: { type: string8, length: 1 },
  x: uint16,
  y: uint16,
  velocityX: int16,
  velocityY: int16,
  identity: { type: string8, length: 12 },
  invincible: uint8, // 0 or 1
  itemsCarried: uint8,
});

export type GuardianState = {
  identity: string;
  leaping: number;
} & CharacterState;

const guardianStateSchema = BufferSchema.schema("guardian", {
  id: { type: string8, length: 1 },
  x: uint16,
  y: uint16,
  velocityX: int16,
  velocityY: int16,
  identity: { type: string8, length: 12 },
  leaping: uint8, // 0 or 1
});

export type ItemState = {
  id: string;
  x: number;
  y: number;
  heldBy: number; // Index into the robbers array, or -1 if on the ground
  storedBy: number;
};

const itemStateSchema = BufferSchema.schema("item", {
  id: { type: string8, length: 1 },
  x: uint16,
  y: uint16,
  heldBy: int8,
  storedBy: uint8,
});

export type StorageState = {
  id: string;
  x: number;
  y: number;
  opened: number;
};

const storageStateSchema = BufferSchema.schema("storage", {
  id: { type: string8, length: 1 },
  x: uint16,
  y: uint16,
  opened: uint8, // 0 or 1
});

export type GameState = {
  gameData: Array<GameData>;
  robbers: Array<RobberState>;
  guardians: Array<GuardianState>;
  storage: Array<StorageState>;
  items: Array<ItemState>;
};

const snapshotSchema = BufferSchema.schema("snapshot", {
  id: { type: string8, length: 6 },
  time: uint64,
  state: {
    gameData: [gameDataSchema],
    robbers: [robberStateSchema],
    guardians: [guardianStateSchema],
    storage: [storageStateSchema],
    items: [itemStateSchema],
  },
});

const snapshotModel = new Model(snapshotSchema);

let gameStateCount = 0;
const SI = new SnapshotInterpolation(SERVER_FPS);

export function generateNewState(mapName: string): GameState {
  const thisGameId = gameStateCount;
  gameStateCount += 1;
  const mapInfo = getMapInfo(mapName);
  return {
    gameData: [
      {
        id: "g",
        mapName: mapInfo.name,
        itemsRemaining: mapInfo.totalItems,
        robberLives: 3,
        gameId: thisGameId,
      },
    ],
    robbers: [],
    guardians: [],
    storage: [],
    items: [],
  };
}

export function createSnapshot(state: GameState): Snapshot {
  return SI.snapshot.create(state);
}

export function compressSnapshot(snap: Snapshot): ArrayBuffer {
  return snapshotModel.toBuffer(snap);
}

export function decompressSnapshot(buf: ArrayBuffer): Snapshot {
  return snapshotModel.fromBuffer(buf);
}

export function parseStateFromSnapshot(snap: Snapshot): GameState {
  return snap.state as GameState;
}

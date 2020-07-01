import {
  generateNewState,
  createSnapshot,
  compressSnapshot,
  decompressSnapshot,
  parseStateFromSnapshot,
} from "../../src/util/StateManagement";

const complexState = {
  gameData: [
    {
      id: "g",
      mapName: "DEVMAP2",
      itemsRemaining: 1,
      robberLives: 3,
      gameId: 1,
    },
  ],
  robbers: [
    {
      id: "\x00",
      x: 30,
      y: 60,
      velocityX: 3,
      velocityY: 0,
      identity: "DISCORDIA",
      invincible: 0,
      itemsCarried: 0,
    },
  ],
  guardians: [
    {
      id: "\x00",
      x: 40,
      y: 63,
      velocityX: 0,
      velocityY: 8,
      identity: "GUARD1",
      leaping: 0,
    },
    {
      id: "\x01",
      x: 50,
      y: 62,
      velocityX: 4,
      velocityY: 4,
      identity: "GUARD2",
      leaping: 1,
    },
  ],
  storage: [{ id: "\x00", x: 10, y: 100, opened: 0 }],
  items: [{ id: "\x00", x: 5, y: 5, heldBy: -1, storedBy: 0 }],
};

test("state generation loads map data", () => {
  const gameState = generateNewState("DEVMAP2");
  expect(gameState.gameData[0].mapName).toBe("DEVMAP2");
  expect(gameState.gameData[0].itemsRemaining).toBe(5);
});

test("snapshot creation on complex state", () => {
  createSnapshot(complexState);
});

test("snapshot compression on complex state", () => {
  const snap = createSnapshot(complexState);
  const compressed = compressSnapshot(snap);
  expect(compressed.byteLength < JSON.stringify(complexState).length).toBe(
    true
  );
  const decompressed = decompressSnapshot(compressed);
  const parsed = parseStateFromSnapshot(decompressed);
  expect(parsed.guardians[1].id).toBe("\x01");
  expect(parsed.items[0].heldBy).toBe(-1);
});

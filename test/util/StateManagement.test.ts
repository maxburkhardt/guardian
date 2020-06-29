import {
  generateNewState,
  prepareStateForSnapshot,
} from "../../src/util/StateManagement";

test("state generation loads map data", () => {
  const gameState = generateNewState("DEVMAP2");
  expect(gameState.map.name).toBe("DEVMAP2");
});

test("proper transformation of new state", () => {
  const gameState = {
    id: 1,
    map: { name: "DEVMAP2", numItems: 1 },
    robbers: [],
    guardians: [],
    robberLives: 3,
    storage: [],
    items: [],
  };
  const transformed = prepareStateForSnapshot(gameState);
  expect(transformed).toEqual(
    expect.arrayContaining([
      { id: "id", value: 1 },
      { id: "robberLives", value: 3 },
      { id: "map", name: "DEVMAP2", numItems: 1 },
    ])
  );
});

test("proper transformation of complex state", () => {
  const gameState = {
    id: 1,
    map: { name: "DEVMAP2", numItems: 1 },
    robbers: [
      {
        x: 30,
        y: 60,
        velocityX: 3,
        velocityY: 0,
        identity: "DISCORDIA",
        invincible: false,
        itemsCarried: 0,
      },
    ],
    guardians: [
      {
        x: 40,
        y: 63,
        velocityX: 0,
        velocityY: 8,
        identity: "GUARD1",
        leaping: false,
      },
      {
        x: 50,
        y: 62,
        velocityX: 4,
        velocityY: 4,
        identity: "GUARD2",
        leaping: true,
      },
    ],
    robberLives: 3,
    storage: [{ x: 10, y: 100, opened: false }],
    items: [{ x: 5, y: 5, heldBy: -1, storedBy: 0 }],
  };
  const transformed = prepareStateForSnapshot(gameState);
  expect(transformed).toEqual(
    expect.arrayContaining([
      { id: "id", value: 1 },
      { id: "robberLives", value: 3 },
      { id: "map", name: "DEVMAP2", numItems: 1 },
      {
        id: "robber_0",
        x: 30,
        y: 60,
        velocityX: 3,
        velocityY: 0,
        identity: "DISCORDIA",
        invincible: "false",
        itemsCarried: 0,
      },
      {
        id: "guardian_0",
        x: 40,
        y: 63,
        velocityX: 0,
        velocityY: 8,
        identity: "GUARD1",
        leaping: "false",
      },
      {
        id: "guardian_1",
        x: 50,
        y: 62,
        velocityX: 4,
        velocityY: 4,
        identity: "GUARD2",
        leaping: "true",
      },
      { id: "storage_0", x: 10, y: 100, opened: "false" },
      { id: "item_0", x: 5, y: 5, heldBy: -1, storedBy: 0 },
    ])
  );
});

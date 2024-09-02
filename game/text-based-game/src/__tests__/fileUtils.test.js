const fs = require("fs");
const path = require("path");
const { saveGameState, loadGameState } = require("../fileUtils");

const filePath = path.join(__dirname, "../gameState.json");

describe("fileUtils", () => {
  afterEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  test("saveGameState should save the game state to a JSON file", () => {
    const state = { player: { health: 100, inventory: [] } };
    saveGameState(state);

    const savedData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    expect(savedData).toEqual(state);
  });

  test("loadGameState should load the game state from a JSON file", () => {
    const state = { player: { health: 100, inventory: [] } };
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2));

    const loadedState = loadGameState();
    expect(loadedState).toEqual(state);
  });

  test("loadGameState should return null if the file does not exist", () => {
    const loadedState = loadGameState();
    expect(loadedState).toBeNull();
  });
});

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "gameState.json");

function saveGameState(state) {
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
}

function loadGameState() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return null;
}

module.exports = { saveGameState, loadGameState };

require("dotenv").config();
const readline = require("readline");
const createAssistant = require("./createAssistant");

// store the assistant ID
let assistantId;

// Create the assistant on start
createAssistant()
  .then((assistantId) => {
    console.log("Assistant created:", assistantId);
    assistantId = assistantId;
  })
  .catch((error) => {
    console.error("Failed to create assistant:", error);
  });

// Function to handle user input
function handleInput(input) {
  // Process the input here
  // ...
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user for input
rl.prompt();

// Listen for user input
rl.on("line", (input) => {
  // Handle the input
  handleInput(input);

  // Prompt the user for more input
  rl.prompt();
});

// Handle the 'close' event
rl.on("close", () => {
  console.log("Exiting the game. Goodbye!");
  process.exit(0);
});

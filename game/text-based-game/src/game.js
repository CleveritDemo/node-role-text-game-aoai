require("dotenv").config();
const readline = require("readline");
const createAssistant = require("./createAssistant");
const OpenAI = require("openai");
const chalk = require("chalk");
const { saveGameState, loadGameState } = require("./fileUtils");

// * Create the assistant on start
async function initializeAssistant() {
  try {
    const assistantId = await createAssistant();
    console.log("Assistant created with ID:", assistantId);
    return assistantId;
  } catch (error) {
    console.error("Failed to create assistant:", error);
    throw error;
  }
}

async function sendMessageToAssistant(openai, threadId, assistantId, content) {
  try {
    // * Send the message to the assistant
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
    });

    // * Get the response from the assistant
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
      instructions:
        "You are a dungeon role master. Provide guidance and assistance to the player.",
    });

    // * Recover messages from the run
    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);

      // * Print the last message from the assistant
      const assistantMessage = messages.data.find(
        (message) => message.role === "assistant"
      );

      console.log(
        chalk.yellow("\nAssistant:"),
        assistantMessage.content[0].text.value
      );

      // * we need to save state, the state will save
      // * the assistantId, threadId, and last message
      // * sent by the user and the assistant

      saveGameState({
        assistantId,
        threadId,
        lastUserMessage: content,
        lastAssistantMessage: assistantMessage.content[0].text.value,
      });
    }
  } catch (error) {
    console.error("Failed to send message to assistant:", error);
  }
}

async function initializeGame() {
  // * Initialize the assistant
  let assistantId = await initializeAssistant();
  let gameStarted = false;
  let threadId = null;

  // * Initialize the OpenAI API client
  const openai = new OpenAI(process.env.OPENAI_API_KEY);

  // * Start showing the game introduction
  console.log(chalk.green("Welcome to the Land of Eldoria!"));

  // * List Options
  console.log("Choose an Option:");
  console.log("Start a new game");
  console.log("Load a saved game");
  console.log("Exit the Game");

  // * Function to handle user input
  async function handleInput(input) {
    const P = ["\\", "|", "/", "-"];
    let x = 0;
    const loader = setInterval(() => {
      process.stdout.write(`\r${P[x++]}`);
      x %= P.length;
    }, 250);

    switch (input) {
      case "Start a new game":
        if (!gameStarted) {
          gameStarted = true;

          try {
            // * Create a thread with the assistant
            const thread = await openai.beta.threads.create();
            threadId = thread.id;

            // * Send the first message to the assistant to start the game
            await sendMessageToAssistant(
              openai,
              threadId,
              assistantId,
              "Start the game"
            );
          } catch (error) {
            console.error("Failed to create thread or send message:", error);
          }
        } else {
          console.log("Game already started!");
        }

        break;
      case "Load a saved game":
        if (!gameStarted) {
          const savedState = loadGameState();
          if (savedState) {
            gameStarted = true;
            assistantId = savedState.assistantId;
            threadId = savedState.threadId;

            try {
              // * Send the last user message to the assistant
              // * We show last assistant message to the user
              console.log(
                chalk.yellow("Assistant:"),
                savedState.lastAssistantMessage
              );
            } catch (error) {
              console.error("Failed to send message to assistant:", error);
            }
          } else {
            console.log("No saved game found!");
          }
        } else {
          console.log("Game already started!");
        }
        break;
      case "Exit the Game":
        console.log("Exiting the game. Goodbye!");
        process.exit(0);
      default:
        if (gameStarted) {
          await sendMessageToAssistant(openai, threadId, assistantId, input);
        } else {
          console.log("Invalid option. Please choose a valid option.");
        }
    }
    clearInterval(loader);
  }

  // * Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // * Prompt the user for input
  rl.prompt();

  // * Listen for user input
  rl.on("line", (input) => {
    // * Handle the input
    handleInput(input);

    // * Prompt the user for more input
    rl.prompt();
  });

  // * Handle the 'close' event
  rl.on("close", () => {
    console.log("Exiting the game. Goodbye!");
    process.exit(0);
  });
}

initializeGame();

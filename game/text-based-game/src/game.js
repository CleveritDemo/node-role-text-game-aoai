require("dotenv").config();
const readline = require("readline");
const createAssistant = require("./createAssistant");
const OpenAI = require("openai");

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

async function initializeGame() {
  // * Initialize the assistant
  const assistantId = await initializeAssistant();
  let gameStarted = false;
  let threadId = null;

  // * Initialize the OpenAI API client
  const openai = new OpenAI(process.env.OPENAI_API_KEY);

  // * Start showing the game introduction
  console.log("Welcome to the Land of Eldoria!");

  // * List Options
  console.log("Choose and Option:");
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

          // * Send first message to assistant to start the game
          // * and get the response from the assistant
          // * and log the response to the console

          try {
            // * Create a thread with the assistant
            const thread = await openai.beta.threads.create();

            threadId = thread.id;

            // * Send the first message to the assistant to start the game
            await openai.beta.threads.messages.create(thread.id, {
              role: "user",
              content: "Start the game",
            });

            // * Get the response from the assistant
            const run = await openai.beta.threads.runs.createAndPoll(
              thread.id,
              {
                assistant_id: assistantId,
                instructions:
                  "You are a dungeon role master. Provide guidance and assistance to the player.",
              }
            );

            // * Recover messages from the run
            if (run.status === "completed") {
              const messages = await openai.beta.threads.messages.list(
                thread.id
              );

              // * Print the last message from the assistant
              const assistantMessage = messages.data.find(
                (message) => message.role === "assistant"
              );

              console.log("Assistant:", assistantMessage.content[0].text.value);
              clearInterval(loader);
            }
          } catch (error) {
            console.error("Failed to create thread or send message:", error);
          }
        } else {
          console.log("Game already started!");
        }
        break;
      case "Load a saved game":
        console.log("Loading a saved game...");
        break;
      case "Exit the Game":
        console.log("Exiting the game. Goodbye!");
        process.exit(0);
      default:
        // * if the game already started, send the user input to the assistant
        // * using the same threadId to continue the game
        if (gameStarted) {
          try {
            // * Send the message to the assistant
            await openai.beta.threads.messages.create(threadId, {
              role: "user",
              content: input,
            });

            // * Get the response from the assistant
            const run = await openai.beta.threads.runs.createAndPoll(threadId, {
              assistant_id: assistantId,
              instructions:
                "You are a dungeon role master. Provide guidance and assistance to the player.",
            });

            // * Recover messages from the run
            if (run.status === "completed") {
              const messages = await openai.beta.threads.messages.list(
                threadId
              );

              // * Print the last message from the assistant
              const assistantMessage = messages.data.find(
                (message) => message.role === "assistant"
              );

              console.log("Assistant:", assistantMessage.content[0].text.value);
              clearInterval(loader);
            }
          } catch (error) {
            console.error("Failed to send message to assistant:", error);
          }
        } else {
          console.log("Invalid option. Please choose a valid option.");
        }
    }
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

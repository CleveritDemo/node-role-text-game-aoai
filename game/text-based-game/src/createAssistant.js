const fs = require("fs");
const OpenAI = require("openai");

async function createAssistant() {
  try {
    // * Initialize the OpenAI API client
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    // * Check if an assistant already exists
    const existingAssistants = await openai.beta.assistants.list();
    const roleMasterAssistant = existingAssistants.data.find(
      (assistant) => assistant.name === "Role Master - Karluiz"
    );

    if (roleMasterAssistant) {
      return roleMasterAssistant.id;
    }

    // * Upload a file with an "assistants" purpose
    const file = await openai.files.create({
      file: fs.createReadStream("LORE.md"),
      purpose: "assistants",
    });

    // * Create an assistant using the file ID
    const assistant = await openai.beta.assistants.create({
      instructions:
        "You are a dungeon role master. When asked a question about the game, provide guidance and assistance to the player.",
      model: "gpt-4o",
      tools: [{ type: "code_interpreter" }],
      tool_resources: {
        code_interpreter: {
          file_ids: [file.id],
        },
      },
      name: "Role Master - Karluiz",
    });

    return assistant.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = createAssistant;

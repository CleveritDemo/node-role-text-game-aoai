// * Upload a file with an "assistants" purpose
const file = await openai.files.create({
  file: fs.createReadStream("mydata.csv"),
  purpose: "assistants",
});

// * Create an assistant using the file ID
const assistant = await openai.beta.assistants.create({
  instructions:
    "You are a personal math tutor. When asked a math question, write and run code to answer the question.",
  model: "gpt-4o",
  tools: [{ type: "code_interpreter" }],
  tool_resources: {
    code_interpreter: {
      file_ids: [file.id],
    },
  },
});

// * Create a thread with the assistant
const thread = await openai.beta.threads.create();

// * Add Message to a thread
const message = await openai.beta.threads.messages.create(thread.id, {
  role: "user",
  content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
});

// * Create a run
let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
  assistant_id: assistantId,
  instructions:
    "You are a personal math tutor. When asked a math question, write and run code to answer the question.",
});

// * Recover messages from the run
const messages = await openai.beta.threads.messages.list(run.thread_id);

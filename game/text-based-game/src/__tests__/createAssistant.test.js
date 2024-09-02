// createAssistant.test.js
const fs = require("fs");
const OpenAI = require("openai");
const createAssistant = require("../createAssistant");

jest.mock("fs");
jest.mock("openai");

describe("createAssistant", () => {
  let openaiMock;

  beforeEach(() => {
    openaiMock = {
      beta: {
        assistants: {
          list: jest.fn(),
          create: jest.fn(),
        },
      },
      files: {
        create: jest.fn(),
      },
    };
    OpenAI.mockImplementation(() => openaiMock);
  });

  it("should return existing assistant ID if assistant already exists", async () => {
    openaiMock.beta.assistants.list.mockResolvedValue({
      data: [{ name: "Role Master - Karluiz", id: "existing-id" }],
    });

    const result = await createAssistant();

    expect(result).toBe("existing-id");
    expect(openaiMock.beta.assistants.list).toHaveBeenCalled();
  });

  it("should create a new assistant if none exists", async () => {
    openaiMock.beta.assistants.list.mockResolvedValue({ data: [] });
    openaiMock.files.create.mockResolvedValue({ id: "file-id" });
    openaiMock.beta.assistants.create.mockResolvedValue({
      id: "new-assistant-id",
    });

    fs.createReadStream.mockReturnValue("file-stream");

    const result = await createAssistant();

    expect(result).toBe("new-assistant-id");
    expect(openaiMock.beta.assistants.list).toHaveBeenCalled();
    expect(openaiMock.files.create).toHaveBeenCalledWith({
      file: "file-stream",
      purpose: "assistants",
    });
    expect(openaiMock.beta.assistants.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Role Master - Karluiz",
      })
    );
  });
});

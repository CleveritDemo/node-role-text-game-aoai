# First Activtity: Getting Started with Text Games and Open AI Assistants

## Create a MD File with a LORE for your Text Game

1. Ask to copilot to create a MD file with a LORE for your Text Game

> your are a dungeon master and you have to create the lore for a text based game, so create a md file with the instructions and also the game lore

### Once you have the file called LORE.md, we will going to create a NodeJS game from a Scratcg with the following steps.

## Create a Node.js Project

> @workspace /new create a new node project for text based game who is going read from stdin and write to stdout

1. Create Workspace on a folder called game
2. ask to copilot CLI how to install dependencies for a node project

> in a terminal write ghcs "how to install dependencies for a node project"

3. Run npm install to install dependencies
4. Test the project with `npm run start`

## Create your Azure Open AI Assistant

1. Use Copilot Chat to translate create-assitant.sh to Node.js using openai.

> create an implementation based on #file:create-assistant.sh for my node project using openai

2. Make modifications on createAssistant.js to return the id of the assistant created

> make modifications on #file:createAssistant.js to return the id of the assistant created

3. Also make additional modifications to read file LORE.md when the assistant is created

> make modifications on #file:createAssistant.js to read LORE.md when the assistant is created using #file:implementationExample.js

4. Make modifications to game.js to create the assistant on start

> make modifications on #file:game.js to create the assistant on start using the createAssistant function

5. Now create a thread using assistant id to get the response from the assistant and make game 
start to read from stdin and write to stdout

> @workspace create a thread with the assistant id, and make the game start to read from stdin and write to stdout #file:game.js

6. Test the game with `npm run start` and make modifications to always take the response from the assistant

- Using comment driven development make the modifications 

7. Ask Copilot how to color the output of stdout in Node.js

> How to color the output of stdout in Node.js 

8. Make modifications to color the output of the game

> Make modifications to color the output of the game using the response from the assistant

## (homework) 

- Create a new file called INSTRUCTIONS.md with the instructions for the game
- Add persistence to the game using a JSON file to save the state of the game

## Finally

- Create a .gitignore file to ignore node_modules and .env files (please don't push my OpenAI API Key ☠️ to any public repository)  

> @workspace create a gitignore for this project, knowing that all the projects is inside a folder called game/text-based-game so for example the node modules is located at game/text-based-game/node_modules

## Troubleshooting

1. Error: Cannot find module 'dotenv'

> Use copilot chat using command TerminalSelection to see how to fix the error
- npm install dotenv


## Hack's

This is the implementation using OpenAI Node.js SDK to create an assistant with a file.

```javascript
    const file = await openai.files.create({
        file: fs.createReadStream("LORE.md"),
        purpose: "fine-tune",
    });

    const assistant = await openai.beta.assistants.create({
            name: "Dungeon Master",
            file_ids: [file.id],
            model: 'gpt-4o',
            tool_resources: {
            code_interpreter: {
                file_ids: [file.id]
            }
        }
    })

    return assistant.id
```
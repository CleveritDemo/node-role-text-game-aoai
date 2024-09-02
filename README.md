# First Activtity: Getting Started with Text Games and Open AI Assistants

- This project has created branches for each step of the activity, so if you get lost you can always check the branch for the step you are in.

## Create a MD File with a LORE for your Text Game

1. Ask to copilot to create a MD file with a LORE for your Text Game

> @workspace your are a dungeon role master and you have to create the lore for a role text based game, so create a MD file with the instructions and also the lore of the game.

### Once you have the file called LORE.md, we will going to create a NodeJS game from a Scratch with the following steps.

## Create a Node.js Project - (Branch: Step-1)

> @workspace /new create a new node project for text based game who is going read from stdin and write to stdout

1. Create Workspace on a folder called game
2. Ask to copilot CLI how to install dependencies for a node project

> On a terminal write ghcs "how to install dependencies for a node project"
> You can also use @Terminal on Copilot Chat to get the answer

3. Run npm install to install dependencies
4. Test the project with `npm run start`

### Create a Git Ignore File 

- Create a .gitignore file to ignore node_modules and .env files (please don't push my OpenAI API Key ☠️ to any public repository)  

> @workspace create a .gitignore for this node project, Taking into account that all the projects is located inside a folder called game/text-based-game so for example: the node_modules golder is located at game/text-based-game/node_modules

## Create your Open AI Assistant - (Branch: Step-2)

1. Use Copilot Chat to create a method called createAssistant using Node.js and openai.

> create an implementation based on #file:implementationExample.js for my node project using openai

2. Make modifications on `createAssistant.js` to return the id of the assistant created

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

## Customize the Game with Colors - (Branch: Step-3)

7. Ask Copilot how to color the output of stdout in Node.js

> How to color the output of stdout in Node.js 

8. Make modifications to color the output of the game

> Make modifications to color the output of the game using the response from the assistant

## (Homework Exercise) Add More Features to the Game

- Create a new file called INSTRUCTIONS.md with the instructions for the game
- Add persistence to the game using a JSON file to save the state of the game
- Add a new command to the game to save the state of the game
- Add unit tests to the game using Jest to test the game logic

## Troubleshooting

1. Error: Cannot find module 'dotenv'

> Use copilot chat using command TerminalSelection to see how to fix the error
- npm install dotenv

2. Chalk version is not working

> Use 4.2.0 version of chalk to make the colors work

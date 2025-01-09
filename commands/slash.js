// this project uses only guild commands, never global commands
import client from '../client.js';
import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SLASH_COMMANDS_PATH = path.join(__dirname, '/slash');
const commandFiles = fs.readdirSync(SLASH_COMMANDS_PATH).filter(file => file.endsWith('.js'));
client.commands = new Collection();

for (const file of commandFiles) {
  const FILE_PATH = path.join(SLASH_COMMANDS_PATH, file);
  import(FILE_PATH).then(module => {
    const command = module.default;
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`${FILE_PATH} に必要な 'data' か 'execute' がありません。`);
    }
  });
}

async function executeSlash(interaction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`${interaction.commandName} が見つかりません。`);
  }

  try {
    await command.execute(interaction);
    return;
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
  }
}

export { executeSlash };
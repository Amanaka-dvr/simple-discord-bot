import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';

const CLIENT_ID = process.env.APPLICATION_ID;
const GUILD_ID = '918212991135125556';
const TOKEN = process.env.DISCORD_BOT_TOKEN;

const commands = [];
const commandFiles = readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

async function importCommands() {
	for (const file of commandFiles) {
		await import(`./commands/slash/${file}`).then(module => {
			const command = module.default;
			commands.push(command.data.toJSON());
		});
	}
}

async function deployCommands() {
	await importCommands();

	const rest = new REST({ version: '10' }).setToken(TOKEN);
	try {
		console.log(`${commands.length} 個のアプリケーションコマンドを登録します。`);

		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);

		console.log(`${data.length} 個のアプリケーションコマンドを登録しました。`);
	} catch (error) {
		console.error(error);
	}
}

deployCommands();
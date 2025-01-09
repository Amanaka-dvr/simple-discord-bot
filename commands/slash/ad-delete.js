import { SlashCommandBuilder } from 'discord.js';
import { 
  readJson,
  writeJson 
} from '../../util.js';

const FILE_PATH = './advertise.json';

export default {
	data: new SlashCommandBuilder()
		.setName('ad-delete')
		.setDescription('広告メッセージ機能の削除')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('設定時に指定した名前を入力してください。')
        .setRequired(true)
    ),
	async execute(interaction) {
    const configs = await readJson(FILE_PATH);
    const name = interaction.options.get("name");
    const names = configs.config.map(el => el[0]);
    console.log(name, "\n", names);
    if (names.includes(name.value) === false) {
      return interaction.reply({ content: "その名前の設定は存在しません。", ephemeral: true });
    } else {
      configs.config = configs.config.filter(arr => arr[0] !== name.value);
    }

    await writeJson(FILE_PATH, configs);
		await interaction.reply({ content: "設定を削除しました。", ephemeral: true });
	},
};
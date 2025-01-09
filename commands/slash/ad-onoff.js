import { SlashCommandBuilder } from 'discord.js';
import { 
  readJson,
  writeJson 
} from '../../util.js';

const FILE_PATH = './advertise.json';

export default {
	data: new SlashCommandBuilder()
		.setName('ad-onoff')
		.setDescription('広告メッセージ機能の起動')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('設定時に指定した名前を入力してください。')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('is-sending')
        .setDescription('起動の有無を指定してください。')
        .setRequired(true) 
        .addChoices(
          {name:'オン', value: 'true'},
          {name:'オフ', value: 'false'}
        )
    ),
	async execute(interaction) {
    const configs = await readJson(FILE_PATH);
    const name = interaction.options.get("name");
    const names = configs.config.map(el => el[0]);
    const isSendingStr = interaction.options.get("is-sending");
    const isSending = JSON.parse(isSendingStr.value);
    let index = 0;
    if (names.includes(name.value) === false) {
      return interaction.reply({ content: "その名前の設定は存在しません。", ephemeral: true });
    } else {
      console.log(configs.config);
      index = names.indexOf(name.value);
      console.log(index);
      console.log(configs.config[index]);
      configs.config[index][5] = isSending;
    }

    await writeJson(FILE_PATH, configs);
		await interaction.reply({ content: "設定が完了しました。", ephemeral: true });
	},
};
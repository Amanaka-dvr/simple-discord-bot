import { SlashCommandBuilder } from 'discord.js';

import { 
  readJson,
  writeJson 
} from '../../util.js';

const FILE_PATH = './advertise.json';

export default {
	data: new SlashCommandBuilder()
		.setName('ad-create')
		.setDescription('定期的な広告用メッセージの送信設定')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('任意の名前を設定してください。')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
      .setName('minutes')
      .setDescription('投稿間隔を5分単位で入力してください。')
      .setRequired(true)
    )
    .addChannelOption(option =>
      option
      .setName('channel')
      .setDescription('投稿先のチャンネルを一つ指定してください。')
      .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('content')
        .setDescription('送信内容を入力してください。')
        .setRequired(true) 
    ),
	async execute(interaction) {
    const configs = await readJson(FILE_PATH);
    
    const name = interaction.options.get("name");
    const names = configs.config.map(el => el[0]);
    if (names.includes(name.value)) {
      return interaction.reply({ content: "同名の設定が既にあります。名前を変更してください。", ephemeral: true });
    }
    const minutes = interaction.options.get("minutes");
    let interval = parseInt(minutes.value / 5) || 1;
    if (interval < 0) interval = -(interval);
    const channel_m = interaction.options.get("channel");
    const channel = channel_m.value.replace(/[^0-9]/g, '');
    const content = interaction.options.get("content");
    const addedConfig = [name.value, interval, 1, channel, content.value, true];
    
    let configList = configs.config;
    configList.push(addedConfig);
    const json = {
      "template": "['name', 'interval', 'time', 'channel_id', 'content', 'isSending']",
      "config": configList
    }
    await writeJson(FILE_PATH, json);
		await interaction.reply({ content: "設定が完了しました。", ephemeral: true });
	},
};
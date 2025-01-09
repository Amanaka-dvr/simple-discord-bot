import discord from 'discord.js';
import { ButtonStyle } from 'discord.js';

const GUILD_ID = '918212991135125556';
const CHANNEL_ID = '1030773911836696597';


async function prepareRole(client) {
  const guild = await client.guilds.fetch(GUILD_ID);
  const channel = await guild.channels.fetch(CHANNEL_ID);

  const params1 = new URLSearchParams(); //ウマ娘
  params1.append('d', 'rp');
  params1.append('rid', '1030744003743842354');
  const params2 = new URLSearchParams(); //マイクラ
  params2.append('d', 'rp');
  params2.append('rid', '1030773031062212691');
  const params3 = new URLSearchParams(); //FPS
  params3.append('d', 'rp');
  params3.append('rid', '1030772094604152903');
  const params4 = new URLSearchParams(); //イベント
  params4.append('d', 'rp');
  params4.append('rid', '1030769676315271270');
  const params5 = new URLSearchParams(); //イラスト
  params5.append('d', 'rp');
  params5.append('rid', '1031884882386898944');

  const button1 = new discord.ButtonBuilder()
    .setCustomId(params1.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel('ウマ娘/UmaMusume')
    .setEmoji('🐎');
  const button2 = new discord.ButtonBuilder()
    .setCustomId(params2.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel('マイクラ/MineCraft')
    .setEmoji('⛏');
  const button3 = new discord.ButtonBuilder()
    .setCustomId(params3.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel('FPS')
    .setEmoji('🔫');
  const button4 = new discord.ButtonBuilder()
    .setCustomId(params4.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel('イベント/event')
    .setEmoji('🎪');
  const button5 = new discord.ButtonBuilder()
    .setCustomId(params5.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel('イラスト/illustration')
    .setEmoji('🎨');

  await channel.send({
    content: '以下のロールを用いてイベントや企画、新着情報などをメンションにて通知予定です。The following roles will be used to announce events, projects, and new information.',
    components: [
      new discord.ActionRowBuilder().addComponents(button1),
      new discord.ActionRowBuilder().addComponents(button2),
      new discord.ActionRowBuilder().addComponents(button3),
      new discord.ActionRowBuilder().addComponents(button4),
      new discord.ActionRowBuilder().addComponents(button5)
    ]
  });
}

export { prepareRole };
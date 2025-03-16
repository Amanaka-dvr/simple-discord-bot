import { EmbedBuilder } from 'discord.js';
import {
  sendReply,
  readJson,
  writeJson,
  syncTimeout,
  randomInt,
  isNotAdmin
} from '../../../util.js';

const USER_FILE_PATH = './omikuzi.json';
const CHARA_FILE_PATH = './uma_chara.json';
const FORMER_URL = 'https://static.kouryaku.tools/umamusume/images/characters/';
const LATTER_URL = '/icon.png';

const DEFAULT_ID = 56;
const defaultWeight = [0, 0.03, 0.07, 0.20, 0.40, 0.20, 0.10, 0];
const thumbnail = [
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item23.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item23.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item24.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item24.png',
  'https://img.gamewith.jp/article_tools%2Fuma-musume%2Fgacha%2Ffukubiki_5.png',
  'https://img.gamewith.jp/article_tools%2Fuma-musume%2Fgacha%2Ffukubiki_5.png'
];

async function resetOmikuji() {
  const date = new Date();
  date.setHours(date.getHours() + 9);
  const jstDate = date.getDate();
  const omikuji = await readJson(USER_FILE_PATH);
  const omikujiDate = omikuji.date;
  const isChangedDate = jstDate !== omikujiDate;
  if (!isChangedDate) return;
  const usedUserData = { "date": jstDate, "id": [] };
  await writeJson(USER_FILE_PATH, usedUserData);
}

async function deleteID(message) {
  if (isNotAdmin(message)) return false;
  if (!message.content.match(/!delete/)) return false;

  const regExp = /[^( |　)]+/g;
  const str = message.content.match(regExp);
  const id = str[1];
  let usedUser = await readJson(USER_FILE_PATH);
  if (!usedUser.id.includes(id)) {
    sendReply(message, 'そのIDは存在しません。');
    return true;
  };
  usedUser.id = usedUser.id.filter((value) => value !== id);
  const usedUserData = { "date": usedUser.date, "id": usedUser.id };
  await writeJson(USER_FILE_PATH, usedUserData);
  sendReply(message, `<@${id}> のおみくじ使用履歴を削除しました。`);
  return true;
}

async function omikuji(message) {
  if (!message.content.match(/!今日の運勢/)) return false;

  ///*
  let usedUser = await readJson(USER_FILE_PATH);
  if (usedUser.id.includes(message.author.id)) {
    sendReply(message, 'おみくじは一日一回まで！');
    return true;
  }
  usedUser.id.push(message.author.id);
  const usedUserData = { "date": usedUser.date, "id": usedUser.id };
  await writeJson(USER_FILE_PATH, usedUserData);
  //*/

  let embedContent = new EmbedBuilder()
    .setTitle(`${message.member.displayName} の うまみくじ`)
    .setThumbnail('https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item13.png')
    .setColor(0xFFFFFF)
    .setTimestamp(new Date);
  const embedMsg = await message.channel.send({ embeds: [embedContent] });

  const umajson = await readJson(CHARA_FILE_PATH);
  const umaData = umajson.data;
  const len = umaData.length;

  const randVal_ID = randomInt(1, len);
  console.log(randVal_ID);
  let randomCharaData = umaData.find(({ id }) => id === randVal_ID);
  if (randomCharaData.name_jp === '' || randomCharaData.omikuji_start === '') {
    randomCharaData = umaData.find(({ id }) => id === DEFAULT_ID);
  }

  //use syncTimeout()
  await syncTimeout(1000);
  embedContent = new EmbedBuilder()
    .setAuthor({ name: randomCharaData.name_jp, iconURL: FORMER_URL + randomCharaData.icon_key + LATTER_URL })
    .setTitle(`${message.member.displayName} の うまみくじ`)
    .setDescription(randomCharaData.omikuji_start)
    .setThumbnail('https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item13.png')
    .setColor(parseInt(randomCharaData.color, 16) || 0xFFFFFF)
    .setTimestamp(new Date);
  embedMsg.edit({ embeds: [embedContent] });
  await syncTimeout(4000);
  embedContent = new EmbedBuilder()
    .setTitle(`${message.member.displayName} の うまみくじ`)
    .setDescription('結果は……')
    .setColor(parseInt(randomCharaData.color, 16) || 0xFFFFFF)
    .setTimestamp(new Date);
  embedMsg.edit({ embeds: [embedContent] });
  await syncTimeout(1000);

  let weight = randomCharaData.omikuji_weight;
  if (weight.length === 0) {
    weight = defaultWeight;
  }
  const result = randomCharaData.omikuji_result;

  let title = '';
  let description = '';
  let image = '';
  
  const randVal_luck = Math.random();
  let sumWeight = 0;
  for (let i = 0; i < weight.length; i++) {
    sumWeight += weight[i];
    if (randVal_luck < sumWeight) {
      title = '結果は……\n' + result[i].title + '！';
      description = result[i].description;
      image = thumbnail[i];
      break;
    }
  }

  embedContent = new EmbedBuilder()
    .setTitle(`${message.member.displayName} の うまみくじ`)
    .setDescription(title)
    .setThumbnail(image)
    .setColor(parseInt(randomCharaData.color, 16) || 0xFFFFFF)
    .setTimestamp(new Date);
  embedMsg.edit({ embeds: [embedContent] });
  await syncTimeout(2000);
  embedContent = new EmbedBuilder()
    .setAuthor({ name: randomCharaData.name_jp, iconURL: FORMER_URL + randomCharaData.icon_key + LATTER_URL })
    .setTitle(`${message.member.displayName} の うまみくじ`)
    .setDescription(description)
    .setThumbnail(image)
    .setColor(parseInt(randomCharaData.color, 16) || 0xFFFFFF)
    .setTimestamp(new Date);
  embedMsg.edit({ embeds: [embedContent] });
  return true;
}

export { omikuji, deleteID, resetOmikuji };
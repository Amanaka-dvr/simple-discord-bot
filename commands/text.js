import client from '../client.js';
import { 
  sendMsg,
  sendReply
} from '../util.js';

import { omikuji, deleteID } from './text/umamusume/omikuji.js';
import { charaRandom } from './text/umamusume/charaRandom.js';
import { courseRandom } from './text/umamusume/courseRandom.js';
import { weaponRandom } from './text/apex/weaponRandom.js';
import { dice } from './text/dice/dice.js';
import { answer } from './text/answer/answer.js';
import { factorization } from './text/factorization/factorization.js';
import { code } from './text/code/code.js';
import { aprilFool } from './text/tmp/aprilFool.js';

const GUILD_ID = '918212991135125556';

async function prefixCommand(message) {
  if (!message.content.match('!')) return false;

  const isOmikuji = await omikuji(message);
  if (isOmikuji) return true;

  const isDeleteID = await deleteID(message);
  if (isDeleteID) return true;

  const isCharaRandom = await charaRandom(message);
  if (isCharaRandom) return true;

  const isCourseRandom = await courseRandom(message);
  if (isCourseRandom) return true;

  const isWeaponRandom = await weaponRandom(message);
  if (isWeaponRandom) return true;

  const isDice = await dice(message);
  if (isDice) return true;

  const isAnswer = await answer(message);
  if (isAnswer) return true;

  const isFactorization = await factorization(message);
  if (isFactorization) return true;

  const isCode = await code(message);
  if (isCode) return true;

  /*
  const isAprilFool = await aprilFool(message);
  if (isAprilFool) return true;
  //*/

  return false; 
}

async function noPrefixCommand(message) {
  if (message.content.match(/ゴルシ、お金ちょうだい/)) {
    const text = '120億で足りるか？';
    sendReply(message, text);
    return true;
  }

  if (message.content.match(/ゴルシおはよう/)) {
    const text = 'おはよーございまーす';
    sendReply(message, text);
    return true;
  }

  if (message.content.match(/ゴルシおやすみ/)) {
    const text = '良い夢見ろよ！';
    sendReply(message, text);
    return true;
  }

  if (message.content.match(/Hey Siri/)) {
    const text = '私はGorusiです';
    sendReply(message, text);
    return true;
  }

  if (message.content.match(/念力|^念$/)) {
    const text = 'ふんにゃか～はんにゃか～';
    sendMsg(message.channel.id, text);
    return true;
  }

  if (message.content.match(/ウマといえば/)) {
    const text = 'Just a Way';
    sendMsg(message.channel.id, text);
    return true;
  }
  
  if (message.content.match(/えい、えい/)) {
    const text = 'むん';
    sendMsg(message.channel.id, text);
    return true;
  }

  if (message.content.match(/暇～/)) {
    const text = '暇ならゴルシちゃんと遊ぼうぜ！';
    sendMsg(message.channel.id, text);
    return true;
  }
  
  if (message.content.match(/火星の天気/)) {
    const text = '猛烈な砂嵐\n最高気温-4℃\n最低気温-95℃';
    sendMsg(message.channel.id, text);
    return true;
  }

  if (message.content.match(/現在のJPレート/)) {
    const rate = 0 + Math.random();
    const text = '1JPT=' + rate + '¥';
    sendMsg(message.channel.id, text);
    return true;
  }

  if (message.content.match(/現在のゴルジptレート/)) {
    const rate = 1 + Math.random() * 0.1;
    const text = '1GJP=' + rate + '¥';
    sendMsg(message.channel.id, text);
    return true;
  }

  if (message.content.match(/肉食いたい/)) {
    const text = 'https://pbs.twimg.com/media/FJSqkGTaAAE8g5r?format=jpg&name=medium';
    sendMsg(message.channel.id, text);
    return true;
  }

  if (message.content.match(/入室日/)) {
    const id = message.author.id;
    const guild = client.guilds.cache.find((g) => g.id === GUILD_ID);
    const user = await guild.members.fetch(id);
    const timestamp = user.joinedTimestamp;
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 9)
    const jst = date.toLocaleString('ja');
    sendReply(message, `あなたは\n${jst}\nにこのサーバーに来ました。`);
    return true;
  }

  return false;
}

async function text(message) {
  const isPrefixCommand = await prefixCommand(message);
  if (isPrefixCommand) return;

  const isNoPrefixCommand = await noPrefixCommand(message);
  if (isNoPrefixCommand) return;
}

export { text };
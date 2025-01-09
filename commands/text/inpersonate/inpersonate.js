import EmbedBuilder from 'discord.js';
import client from '../../../client.js';
import {
  isNotAdmin,
  sendMsg,
  sendReply, 
  readJson, 
  writeJson,
  httpPost
} from '../../../util.js';

const FILE_PATH = './inpersonate.json';
const MAIN_CHANNEL_ID = '937260648218361856';
const SUB_CHANNEL_ID = '937522865354473522';
const LOG_CHANNEL_ID = '934986946663559198';
const GUILD_ID = '918212991135125556';

let charaList = [];
let gorushiId = '505846772069826571';

async function readInpJson() {
  const json = await readJson(FILE_PATH);
  charaList = json.charaList;
}

async function writeInpJson() {
  const json = {
    "template": "['current_id', 'default_id', 'url', 'name_en', 'name_ja', default_flag, 'original_url']",
    "charaList": charaList
  }
  await writeJson(FILE_PATH, json);
}

async function adminCommand(message) {
  if (isNotAdmin(message)) return false;
  if (message.content.match(/!遠隔送信/)) {
    await readInpJson();
    const regExp = /[^( |　)]+/g;
    const str = message.content.match(regExp);
    const nameJA = str[1];
    const text = str[2];
    const charaData = charaList.find((num) => num[4] === nameJA);
    if (!charaData) {
      sendReply(message, `${nameJA}は在籍していません。`);
      return true;
    }
    const data = {
      method: 'post',
      type: 'sendRawText',
      content: text,
      muteHttpExceptions: true
    };
    httpPost(charaData[2], data);
    message.delete();
    return true;
  }
  
  if (message.content.match(/!編集/)) {
    const regExp = /[^( |　)]+/g;
    const str = message.content.match(regExp);
    const messageID = str[1];
    const text = str[2];
    const channel = client.channels.cache.get(MAIN_CHANNEL_ID);
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.find(wh => wh.token);
    await webhook.editMessage(messageID, {
      content: text
    });
    return true;
  }
  
  if (message.content.match(/!詳細編集/)) {
    const regExp = /[^( |　)]+/g;
    const str = message.content.match(regExp);
    const messageID = str[1];
    const text = str[2];
    const color = str[3];
    const title = str[4];
    const description = str[5];
    const channel = client.channels.cache.get(MAIN_CHANNEL_ID);
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.find(wh => wh.token);
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(color)
      .setDescription(description);
    await webhook.editMessage(messageID, {
      content: text,
      embeds: [embed]
    });
    return true;
  }

  return false;
}

async function publicCommand(message) {
  if (message.channel.id !== SUB_CHANNEL_ID) return false;

  if (message.content.match(/!解除/)) {
    await readInpJson();
    const index = charaList.findIndex((num) => num[0] === message.author.id);
    if (index === -1) {
      sendReply(message, '既に役がありません');
      return true;
    }
    if (charaList[index][1] === message.author.id) {
      charaList[index][0] = '';
      await writeInpJson();
      sendReply(message, '解除しました');
      return true;
    }
    charaList[index][0] = charaList[index][1];
    await writeInpJson();
    sendReply(message, '解除しました');
    return true;
  }
  
  if (message.content.match(/!呼出/)) {
    await readInpJson();
    const regExp = /[^\s]+/g;
    const str = message.content.match(regExp);
    const nameJA = str[1];
    const charaData = charaList.find((num) => num[4] === nameJA);
    if (charaData === undefined) {
      sendReply(message, `${nameJA}は在籍していません。`);
      return true;
    }
    const data = {
      method: 'post',
      type: 'wake',
      muteHttpExceptions: true
    };
    if (charaData[5]) {
      sendReply(message, `${charaData[4]}は呼び出せません。`);
      return true;
    }
    httpPost(charaData[2], data);
    sendReply(message, `${charaData[4]}を呼び出しています……`);
    return true;
  }
  
  if (message.content.match(/!設定/)) {
    await readInpJson();
    const regExp = /[^\s]+/g;
    const str = message.content.match(regExp);
    const nameJA = str[1];
    if (nameJA === undefined) {
      sendReply(message, `担当名を入力してください。`);
      return true;
    }
    const index = charaList.findIndex((num) => num[4] === nameJA);
    if (index === -1) {
      sendReply(message, `${nameJA}は在籍していません。`);
      return true;
    }
    if (charaList.some((num) => num[0] === message.author.id)) {
      const originIndex = charaList.findIndex((num) => num[0] === message.author.id);
      const originNameJA = charaList[originIndex][4];
      sendReply(message, `担当を ${originNameJA} から ${nameJA} に更新します。`);
      if (charaList[originIndex][1] === message.author.id) {
        charaList[originIndex][0] = '';
      } else {
        charaList[originIndex][0] = charaList[originIndex][1];
      }
    }
    charaList[index][0] = message.author.id;
    await writeInpJson();
    sendReply(message, '設定しました');
    return true;
  }
  
  if (message.content.match(/!担当/)) {
    await readInpJson();
    const regExp = /[^\s]+/g;
    const str = message.content.match(regExp);
    const nameJA = str[1];
    if (nameJA === undefined) {
      sendReply(message, `担当名を入力してください。`);
      return true;
    }
    const charaData = charaList.find((num) => num[4] === nameJA);
    if (charaData === undefined) {
      sendReply(message, `${nameJA}は在籍していません。`);
      return true;
    }
    const userID = charaData[0];
    const guild = client.guilds.cache.find((g) => g.id === GUILD_ID);
    if (userID === '') {
      sendReply(message, `${charaData[4]}は担当がいません。`);
      return true;
    }
    const user = await guild.members.fetch(userID);
    sendReply(message, `${charaData[4]}の担当は${user.displayName}です。`)
    return true;
  }

  return false;
}

async function goldShip(message) {
  if (message.channel.id !== SUB_CHANNEL_ID) return false;

  if (message.content.match(/!ゴルシになる/)) {
    sendReply(message, '設定しました');
    gorushiId = message.author.id;
    return true;
  }

  if (message.content.match(/!今のゴルシ/)) {
    const text = '<@' + gorushiId + '>';
    sendReply(message, text);
    return true;
  }

  return false;
}

async function postedInMainChannel(message) {
  if (message.channel.id !== MAIN_CHANNEL_ID) return false;

  if (message.author.id === gorushiId) {
    const file = message.attachments.first();
    let text = message.content + '\n';
    sendMsg(message.channel.id, text);
    message.delete();
    return true;
  }

  await readInpJson();
  const charaData = charaList.find((num) => num[0] === message.author.id);
  if (charaData === undefined) {
    const title = '【演者でない人による投稿です】';
    let text = title + '\nuser:　' + message.member.displayName + '\nchannel:　<#' + message.channel.id + '>\ntext:\n' + message.content + '\n';
    sendMsg(LOG_CHANNEL_ID, text);
    message.delete();
    return true;
  }
  const data = {
    method: 'post',
    type: 'sendRawText',
    content: message.content,
    muteHttpExceptions: true
  };
  httpPost(charaData[2], data);
  message.delete();
  return true;
}

async function inpersonate(message) {
  const isAdminCommand = await adminCommand(message);
  if (isAdminCommand) return true;

  const isPublicCommand = await publicCommand(message);
  if (isPublicCommand) return true;

  const isGoldShip = await goldShip(message);
  if (isGoldShip) return true;
  
  const isPostedInMainChannel = await postedInMainChannel(message);
  if (isPostedInMainChannel) return true;

  return false;
}

export { inpersonate };
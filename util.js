import { PermissionsBitField } from "discord.js";
import client from "./client.js";
import fs from "fs";
import axiosBase from "axios";

function isNotUser(message) {
  return message.author.id === client.user.id || message.author.bot;
}

function isNotAdmin(message) {
  return !message.member.permissions.has(PermissionsBitField.Flags.Administrator);
}

function isNotInGuild(message) {
  return !message.guild;
}

function sendReply(message, text) {
  message.reply(text)
    .then(console.log('リプライ送信: ' + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option = {}) {
  return client.channels.cache.get(channelId).send(text, option)
    .then(console.log('メッセージ送信: ' + text + JSON.stringify(option)))
    .catch(console.error);
}

async function sendDM(userID, text) {
  const user = await client.users.fetch(userID);
  user.send(text);
}

async function readJson(filePath) {
  try {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return json;
  } catch (err) {
    console.error(err);
  }
}

async function writeJson(filePath, json) {
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8', (err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function httpPost(url, data) {
  const axios = axiosBase.create({
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    responseType: 'json',
  });
  console.log('in here');
  axios.post(url, data)
    .then((response) => console.log(response.data + 'hello! here'))
    .catch(console.error);
}

function syncTimeout(ms) {
  return new Promise( resolve => {
    setTimeout(() => {
      console.log(`waiting ${ms} ms...`);
      resolve();
    }, ms);
  });
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { 
  isNotUser,
  isNotAdmin,
  isNotInGuild,
  sendReply,
  sendMsg,
  sendDM,
  readJson,
  writeJson,
  httpPost,
  syncTimeout,
  randomInt
};
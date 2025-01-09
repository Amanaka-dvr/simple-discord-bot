import {
  sendMsg,
  syncTimeout,
  readJson,
  writeJson
} from '../../util.js';

const FILE_PATH = './advertise.json';

async function asyncAD(config) {
  const ms = config[1] * 300000; // in 5 min. intervals -> in 300000 ms. intervals
  const CHANNEL_ID = config[3];
  const TEXT = config[4];
  const msgSent = await sendMsg(CHANNEL_ID, TEXT);
  config[2] = 1; // reset time

  await syncTimeout(ms);
  await msgSent.delete();
}

async function sendAD() {
  const configs = await readJson(FILE_PATH);
  let configList = configs.config;

  const LENGTH = configList.length;
  for (let i = 0; i < LENGTH; i++) {
    const config = Array.from(configList)[i];
    if (config[5]) {
      if (config[2] >= config[1]) {
        asyncAD(config);
      } else {
        config[2]++;
      }
    }
  }

  const json = {
    "template": "['name', 'interval', 'time', 'channel_id', 'content', 'isSending']",
    "config": configList
  }
  await writeJson(FILE_PATH, json);
}

export { sendAD };
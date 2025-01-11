import {
  sendReply,
  readJson,
  sendMsg
} from '../../../util.js';

const FILE_PATH = './uma_chara.json';


const FORMER_URL = 'https://static.kouryaku.tools/umamusume/images/characters/';
const LATTER_URL = '/icon.png';
const embedContent = {
  author: {
    name: '',
    icon_url: ''
  },
  title: '',
  description: '',
  color: '',
  timestamp: new Date()
};

async function charaMessage(message) {
  if (!message.content.match(/!createUma/)) return false;

  const umajson = await readJson(FILE_PATH);
  const umaData = umajson.data;
  const msg = message.content.split(' ');
  const name = msg[1];
  const color = parseInt(msg[2], 16);
  const text = msg[3].replace(/\\n/g, '\n');;
  

  const uma = umaData.find(({ icon_key }) => icon_key === name);
  if (!uma) {
    sendReply(message, 'そのウマ娘は存在しません。');
    return true;
  }

  const url = FORMER_URL + name + LATTER_URL;
  embedContent.author.name = uma.name_jp;
  embedContent.author.icon_url = url;
  embedContent.description = text;
  embedContent.color = color;
  sendMsg(message.channel.id, { embeds: [embedContent] });
  return true;
}

export { charaMessage };
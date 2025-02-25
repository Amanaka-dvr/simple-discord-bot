import {
  isNotAdmin,
  sendReply,
  readJson,
  randomInt
} from '../../../util.js';

const FILE_PATH = './uma_chara.json';
const noTargetUser = [
  '505846772069826571',
  '852923175406141460',
  '1035154954412888104',
  '1020304540270075944'
]

const FORMER_URL = 'https://static.kouryaku.tools/umamusume/images/characters/';
const LATTER_URL = '/icon.png';
const embedContent = {
  author: {
    name: 'ゴールドシップ',
    icon_url: 'https://cdn.discordapp.com/avatars/933850580441497621/b8881916b0e86aa40c0914307c6a306c.png?size=4096'
  },
  title: 'ランダムウマ娘選出！',
  description: '',
  color: 0xDA3C57,
  timestamp: '',
  thumbnail: {
    url: ''
  }
};

async function randomCharaPrint(randomCharaData) {
  const text = `選ばれたウマ娘は ${randomCharaData.name_jp} だ！`;
  const url = FORMER_URL + randomCharaData.icon_key + LATTER_URL;
  embedContent.description = text;
  embedContent.thumbnail.url = url;
  embedContent.timestamp = new Date();
  sendReply(message, { embeds: [embedContent] });
  return true;
}

async function charaRandom(message) {
  if (!message.content.match(/!uma/)) return false;

  const umajson = await readJson(FILE_PATH);
  const umaData = umajson.data;
  const len = umaData.length;

  let randVal = randomInt(1, len);

  // for announcement
  if (!isNotAdmin(message) && message.content.match(/test/)) {
    const startID = 127;
    const endID = 134;

    for (let i = startID; i <= endID; i++) {
      const randomCharaData = umaData.find(({ id }) => id === i);
      randomCharaPrint(randomCharaData);
    }

    return true;
  }

  // for trolls
  /*
  if (noTargetUser.includes(message.author.id)) {
    const text = 'あなたはサービスの対象者ではありません。';
    sendReply(message, text);
    return;
  }
  //*/

  let randomCharaData = umaData.find(({ id }) => id === randVal);
  while (randomCharaData.name_jp === '') {
    randVal = randomInt(1, len);
    randomCharaData = umaData.find(({ id }) => id === randVal);
  }

  randomCharaPrint(randomCharaData);
  return true;
}

export { charaRandom };
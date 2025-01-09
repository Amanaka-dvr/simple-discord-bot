import {
  sendReply,
  readJson,
  writeJson,
  syncTimeout
} from '../../../util.js';

const FILE_PATH = './omikuzi.json';
const embedContent = {
  author: {
    name: 'ゴールドシップ',
    icon_url: 'https://cdn.discordapp.com/avatars/933850580441497621/b8881916b0e86aa40c0914307c6a306c.png?size=4096'
  },
  title: '',
  description: '今日の運勢を占ってみるのか！？',
  color: 0xDA3C57,
  timestamp: new Date(),
  thumbnail: {
    url: 'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item13.png'
  }
};
const weight = [0.001, 0.009, 0.02, 0.07, 0.20, 0.50, 0.10, 0.07, 0.03];
const luck = ['\nスーパースペシャル特大吉！', '\n超吉！', '\n大吉！', '\n吉！', '\n中吉！', '\n小吉！', '\n末吉！', '\n凶！', '\n大凶！'];
const explanation = [
  '\n運勢が限界突破しています！神がかっていますね！',
  '\n向かうところ敵なし！どんな勝負にも勝てそうです！',
  '\nおお！開運パワー全開ですね！',
  '\nスピリチュアルパワーがみなぎっています！',
  '\nなかなかラッキーですね！',
  '\nどっちつかずですが、普通が一番です！',
  '\n家で休んでいたほうが良さそうです……',
  '\nこ、これは…厄落とししないとぉ〜！',
  '\n靴ひもが切れたり、側溝に落ちたり、黒猫を見かけたり、物が壊れたり、最低保証だったりもう救いはありません～！'
];
const thumbnail = [
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item23.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item23.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item24.png',
  'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item24.png',
  'https://img.gamewith.jp/article_tools%2Fuma-musume%2Fgacha%2Ffukubiki_5.png',
  'https://img.gamewith.jp/article_tools%2Fuma-musume%2Fgacha%2Ffukubiki_5.png'
];

/*
const weight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1.0];
const luck = ['', '', '', '', '', '', '', '', '', '\n確率だけは最強！'];
const explanation = ['', '', '', '', '', '', '', '', '', '\nめちゃくちゃ運は良いと思うんですけど、降ってきた隕石があなたにクリティカルヒットするかも！'];
const thumbnail = ['', '', '', '', '', '', '', '', '', 'https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png'];
//*/

async function resetOmikuji() {
  const date = new Date();
  date.setHours(date.getHours() + 9);
  const jstDate = date.getDate();
  const omikuji = await readJson(FILE_PATH);
  const omikujiDate = omikuji.date;
  const isChangedDate = jstDate !== omikujiDate;
  if (!isChangedDate) return;
  const usedUserData = { "date": jstDate, "name": [] };
  await writeJson(FILE_PATH, usedUserData);
}

async function omikuji(message) {
  if (!message.content.match(/!今日の運勢/)) return false;

  let usedUser = await readJson(FILE_PATH);
  if (usedUser.name.includes(message.author.id)) {
    sendReply(message, 'おみくじは一日一回まで！');
    return true;
  }
  usedUser.name.push(message.author.id);
  const usedUserData = { "date": usedUser.date, "name": usedUser.name };
  await writeJson(FILE_PATH, usedUserData);

  embedContent.title = `${message.member.displayName} の うまみくじ`;
  const embedMsg = await message.channel.send({ embeds: [embedContent] });

  //use syncTimeout()
  await syncTimeout(2000);
  embedContent.description = 'あいつに聞いてみようぜ！';
  embedMsg.edit({ embeds: [embedContent] });
  await syncTimeout(2000);
  embedContent.author.name = 'マチカネフクキタル';
  embedContent.author.icon_url = 'https://lh3.googleusercontent.com/vi-vu8EV0hbgGH9yRhmMl-euftAA_U9_TumQ3TOfZ9t0YPWXHbPwsgydbpdgaYmOnUtXqxn59TaHE1nGwFfUBK8W-rBsXh39MdUpBkblvGY=rw';
  embedContent.description = 'おみくじですね！';
  embedMsg.edit({ embeds: [embedContent] });
  await syncTimeout(2000);
  embedContent.description = 'はんにゃか〜…！ふんにゃか〜…！';
  embedMsg.edit({ embeds: [embedContent] });
  await syncTimeout(2000);
  embedContent.description = '出ましたっ！';
  embedMsg.edit({ embeds: [embedContent] });

  const randVal = Math.random();
  let text = '';
  let image = '';
  let sumWeight = 0;
  for (let i = 0; i < weight.length; i++) {
    sumWeight += weight[i];
    if (randVal < sumWeight) {
      text = luck[i] + explanation[i];
      image = thumbnail[i];
      break;
    }
  }
  await syncTimeout(2000);
  embedContent.description = '出ましたっ！' + text;
  embedContent.thumbnail.url = image;
  embedMsg.edit({ embeds: [embedContent] });
  return true;
}

export { omikuji, resetOmikuji };
import http from 'http';
import querystring from 'querystring';
import client from './client.js';

/*
* webhook bots
* アグネスデジタル
* エアグルーヴ
* オグリキャップ
* サイレンススズカ
* サクラバクシンオー
* シンボリルドルフ
* スペシャルウィーク
* タマモクロス
* トウカイテイオー
* ナリタブライアン
*/

import { wakeEvent } from './commands/http.js';
import { eventListener } from './eventListener.js';

http.createServer(function (req, res) {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', function (chunk) {
      data += chunk;
    });
    req.on('end', function () {
      if (!data) {
        console.log('No post data');
        res.end();
        return;
      }
      const dataObject = querystring.parse(data);
      if (dataObject.type === 'wake') {
        console.log('Woke up in post');
        wakeEvent();
        res.end();
        return;
      }
      res.end();
    });
  } else if (req.method === 'GET') {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end('Discord bot is active now \n');
  }
}).listen(3000);

eventListener();

if (process.env.DISCORD_BOT_TOKEN === undefined) {
  console.log('DISCORD_BOT_TOKENが設定されていません。');
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
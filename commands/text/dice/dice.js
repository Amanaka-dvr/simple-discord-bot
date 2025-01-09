import {
  sendReply,
  randomInt
} from '../../../util.js';

async function dice(message) {
  if (!message.content.match(/!dice/)) return false;
  
  const regexp = /(\d+)d(\d+)/;
  const regexpPlus = /(\d+)d(\d+)(\+\d+)/;
  const regexpMinus = /(\d+)d(\d+)(\-\d+)/;
  const regexpTimes = /(\d+)d(\d+)(\*\d+)/;
  const regexpDivide = /(\d+)d(\d+)(\/\d+)/;
  const regexpPower = /(\d+)d(\d+)(\^\d+)/;
  let ndn = [];
  let d = 0;
  let n = 0;
  let x = 0;
  let mode = 0; // 0: normal, 1: plus, 2: minus, 3: times, 4: divide, 5: power

  if (message.content.match(regexpPlus)) {
    ndn = message.content.match(regexpPlus);
    d = parseInt(ndn[1]);
    n = parseInt(ndn[2]);
    x = parseInt(ndn[3]);
    mode = 1;
  } else if (message.content.match(regexpMinus)) {
    ndn = message.content.match(regexpMinus);
    d = parseInt(ndn[1]);
    n = parseInt(ndn[2]);
    x = -parseInt(ndn[3]);
    mode = 2;
  } else if (message.content.match(regexpTimes)) {
    ndn = message.content.match(regexpTimes);
    d = parseInt(ndn[1]);
    n = parseInt(ndn[2]);
    x = parseInt(ndn[3].substr(1));
    if (x > 100) {
      sendReply(message, '掛ける数が大きすぎます。');
      return true;
    }
    mode = 3;
  } else if (message.content.match(regexpDivide)) {
    ndn = message.content.match(regexpDivide);
    d = parseInt(ndn[1]);
    n = parseInt(ndn[2]);
    x = parseInt(ndn[3].substr(1));
    mode = 4;
  } else if (message.content.match(regexpPower)) {
    ndn = message.content.match(regexpPower);
    d = parseInt(ndn[1]);
    n = parseInt(ndn[2]);
    x = parseInt(ndn[3].substr(1));
    if (x > 3) {
      sendReply(message, '指数が大きすぎます。');
      return true;
    }
    mode = 5;
  } else {
    ndn = message.content.match(regexp);
    d = parseInt(ndn[1]);
    n = parseInt(ndn[2]);
    mode = 0;
  }

  if (d > 100) {
    sendReply(message, 'ダイスの数が多すぎます。');
    return true;
  }

  if (n > 65535) {
    sendReply(message, '面の数が多すぎます。');
    return true;
  }

  if (x > 65535) {
    sendReply(message, '計算対象の数が大きすぎます。');
    return true;
  }

  const msg1 = `${n}面ダイスを${d}回振ります。\n結果は次の通りです。`;
  let result = [];
  for (let i = 0; i < d; i++) {
    result.push(randomInt(1, n));
  }
  const msg2 = result.join(', ');
  let sum = result.reduce((a, x) => a + x);
  let text = '';
  if (x > 0) {
    switch (mode) {
      case 1:
        sum += x;
        text = `${msg1}\n${msg2}\n合計に${x}を足した値は${sum}です。`;
        break;
      case 2:
        sum -= x;
        text = `${msg1}\n${msg2}\n合計から${x}を引いた値は${sum}です。`;
        break;
      case 3:
        sum *= x;
        text = `${msg1}\n${msg2}\n合計に${x}を掛けた値は${sum}です。`;
        break;
      case 4:
        sum /= x;
        text = `${msg1}\n${msg2}\n合計を${x}で割った値は${sum}です。`;
        break;
      case 5:
        sum = Math.pow(sum, x);
        text = `${msg1}\n${msg2}\n合計を${x}乗した値は${sum}です。`;
        break;
    }
  } else {
    text = `${msg1}\n${msg2}\n合計は${sum}です。`;
  }

  sendReply(message, text);
  return true;
}

export { dice };
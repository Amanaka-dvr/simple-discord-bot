import { sendReply } from '../../../util.js';

let canReply = false;
const THRESHOLD = 0.4;

async function answer(message) {
  if (message.content.match(/\!はい/)) {
    if (!canReply) {
      const text = '回答受付を終了しました';
      sendReply(message, text);
      return true;
    }

    const randVal = Math.random();
    if (randVal < THRESHOLD) {
      canReply = false;
      const text = '回答権を獲得しました';
      sendReply(message, text);
    } else {
      message.delete();
    }
    return true;
  }

  if (message.content.match(/\!どうぞ/)) {
    canReply = true;
    return true;
  }

  return false;
}

export { answer };
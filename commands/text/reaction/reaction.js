import { sendReply } from '../../../util.js';

async function powerMessage(message) {
  const isPower = 
    message.author.id === '696698066597838849'
    || message.author.id === '910381775874834462'
  if (isPower) {
    message.react('933971549361414174') // <:A1_so_good:933971549361414174>
      .catch(console.error);
    return false; // do not return true otherwise the bot will not respond to other commands
  }

  if (message.content.match(/[pPｐＰ][oOｏＯ0０〇][wWｗＷ][eEｅＥ][rRｒＲ]|[ぱパ][わワクﾜｸ][一ー－―‐～₋⁻—￣ー]/)) {
    if (message.content.match(/[pPｐＰ][oOｏＯ0０〇][wWｗＷ][eEｅＥ][rRｒＲ](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|[ぱパ][わワクﾜｸ][一ー－―‐～₋⁻—￣ー](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|ミントモーション殿下/)) {
      message.react('933971549361414174') // <:A1_so_good:933971549361414174>
        .catch(console.error);
      return true;
    } else {
      sendReply(message, '殿下を無礼るなぁ！');
      return true;
    }
  }
}

async function reaction(message) {
  const isPowerMessage = await powerMessage(message);
  if (isPowerMessage) return true;

  return false;
}

export { reaction };
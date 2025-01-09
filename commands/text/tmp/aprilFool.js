import { 
  sendMsg, 
  sendReply 
} from '../../../util.js';

async function aprilFool(message) {
  if (message.content.match(/!april/)){
    const re = /[^\s]+/g;
    const name = message.content.match(re)[1];
    const member = message.mentions.members.first();
  
    if (!member.manageable) {
      sendReply(message, 'このユーザーへの管理権限がありません');
      return true;
    }
    
    member.setNickname(name);
  
    const title = '【エイプリルフールコマンド】';
    const text = title
      + '\nuser:　'
      + message.member.displayName
      + '\nchannel:　<#'
      + message.channel.id
      + '>\ntext:\n'
      + message.content
      + '\n';
    sendMsg(LOG_CHANNEL_ID, text);
  
    sendReply(message, '設定しました');
    return true;
  }

  return false;
}

export { aprilFool };
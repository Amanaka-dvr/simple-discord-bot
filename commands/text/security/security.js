import { 
  isNotAdmin,
  sendMsg,
  sendReply
} from '../../../util.js';

let emergency = false;
let timeoutUsers = [];
const blackList = process.env.BLACK_LIST.split(' ');
const LOG_CHANNEL_ID = '934986946663559198';

async function emergencyMode(message) {
  if (isNotAdmin(message)) return false;

  if (message.content.match(/[!！]緊急/)) {
    sendReply(message, '設定しました');
    emergency = true;
    return true;
  }
  if (message.content.match(/[!！]緊急解除/)) {
    sendReply(message, '解除しました');
    emergency = false;
    return true;
  }

  return false;
}

async function adminCommand(message) {
  if (isNotAdmin(message)) return false;

  if (message.content.startsWith('!kick')) {
    if (message.mentions.members.size !== 1) {
      message.channel.send('キックするメンバーを1人指定してください')
      return true;
    }
    const member = message.mentions.members.first();
    if (!member.kickable) {
      message.channel.send('このユーザーをキックすることができません')
      return true;
    }

    //await member.kick();

    message.channel.send(`${member.user.tag}をキックしました`)
    return true;
  }

  if (message.content.startsWith('!timeout')) { // can join voice channel but cannot leave message
    if (message.mentions.members.size !== 1) {
      message.channel.send('タイムアウトするメンバーを1人指定してください');
      return true;
    }
    const member = message.mentions.members.first();
    if (!member.manageable) {
      message.channel.send('このユーザーをタイムアウトすることができません')
      return true;
    }
    timeoutUsers.push(member.id);
    message.channel.send(`${member.user.tag}をタイムアウトしました`);
    return true;
  }

  if (message.content.startsWith('!rmtimeout')) {
    if (message.mentions.members.size !== 1) {
      message.channel.send('解除するメンバーを1人指定してください')
      return true;
    };
    const member = message.mentions.members.first();
    for (let i = 0; i < timeoutUsers.length; i++) {
      if (member.id === timeoutUsers[i]) {
        timeoutUsers = timeoutUsers.filter(item => (item.match(timeoutUsers[i])) === null);
        console.log(timeoutUsers);
      }
    }
    message.channel.send(`${member.user.tag}のタイムアウトを解除しました`);
    return true;
  }

  if (message.content.match(/!explosion/)) {
    let re = /[^\s]+/g;
    let scdstr = message.content.match(re);
    let scd = scdstr.map(str => parseInt(str, 10));
    scd[1] = scd[1] || 1;
    console.log(scd[1]);
    const messages = await message.channel.messages.fetch({ limit: scd[1] });
    message.channel.bulkDelete(messages);
    return true;
  };

  return false;
}

async function monitoredUser(message) {
  if (timeoutUsers.includes(message.author.id)) {
    let title = '【タイムアウト中の人物の発言です】';
    let text = title + '\nuser:　' + message.member.displayName + '\nchannel:　<#' + message.channel.id + '>\ntext:\n' + message.content + '\n';
    sendMsg(LOG_CHANNEL_ID, text);
    message.delete();
    return true;
  }

  if (blackList.includes(message.author.id)) {
    let title = '【要注意人物の発言です】';
    let text = title + '\nuser:　' + message.member.displayName + '\nchannel:　<#' + message.channel.id + '>\ntext:\n' + message.content + '\n';
    sendMsg(LOG_CHANNEL_ID, text);
    return true;
  }

  return false;
}

async function ngWord(message) {
  if (message.content.match(/ﾀﾋね|56すぞ/)) {
    let title = '【禁止用語が含まれています】';
    let text = title + '\nuser:　' + message.member.displayName + '\nchannel:　<#' + message.channel.id + '>\ntext:\n' + message.content + '\n';
    sendMsg(LOG_CHANNEL_ID, text);
    return true;
  }
  if (message.content.match(/https?:\/\//)) {
    let title = '【外部サイトへのリンクが含まれています】';
    let text = title + '\nuser:　' + message.member.displayName + '\nuserID:　' + message.author.id + '\nchannel:　<#' + message.channel.id + '>\ntext:\n' + message.content + '\n';
    sendMsg(LOG_CHANNEL_ID, text);
    return true; //do not always return true if you use like music commands
  }

  return false;
}

async function security(message) {
  const isEmergencyMode = await emergencyMode(message);
  if (isEmergencyMode) return true;

  const isAdminCommand = await adminCommand(message);
  if (isAdminCommand) return true;

  const isMonitoredUser = await monitoredUser(message);
  if (isMonitoredUser) return true;

  const isNgWord = await ngWord(message);
  if (isNgWord) return true;
  
  if (emergency) {
    message.delete();
    return true;
  }

  return false;
}

export { security };
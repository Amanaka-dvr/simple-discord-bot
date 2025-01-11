import client from './client.js';
import {
  isNotUser,
  isNotInGuild,
  sendMsg,
  sendDM
} from './util.js';


import { prepareRole } from './deploy_buttons.js';

import { executeButton } from './commands/button.js';
import { executeSlash } from './commands/slash.js';

import { security } from './commands/text/security/security.js';
import { inpersonate } from './commands/text/inpersonate/inpersonate.js';
import { translate } from './commands/text/translation/translation.js';
import { reaction } from './commands/text/reaction/reaction.js';
import { text } from './commands/text.js';

import { charaMessage } from './commands/text/umamusume/charaMessage.js';

const LOG_CHANNEL_ID = '934986946663559198';
const CHIEF_ADMIN_ID = '786914493640081438';

function sendOnce() {
  //prepareRole(client);
}

function eventListener() {
  ////////////client ready////////////
  client.once('ready', async () => {
    console.log('準備完了');
    client.user.setPresence({ activities: [{ name: 'トーセンジョーダン' }] });

    //to followUp the event emitted before the bot is ready 
    client.on('interactionCreate', async interaction => {
      if (interaction.isButton()) {
        await executeButton(interaction);
        return;
      }
      if (interaction.isChatInputCommand()) {
        await executeSlash(interaction);
        return;
      }
    });

    sendOnce();
  });

  ////////////guild message////////////
  client.on('messageCreate', async message => {
    if (isNotUser(message)) return;
    if (isNotInGuild(message)) return;

    // security command
    const isSecurity = await security(message);
    if (isSecurity) return;

    // narikiri command
    const isNarikiri = await inpersonate(message);
    if (isNarikiri) return;

    // translate command
    const isTranslate = await translate(message);
    if (isTranslate) return;

    // reaction command
    const isReaction = await reaction(message);
    if (isReaction) return;

    // text commands
    await text(message);
  });

  ////////////guild message update////////////
  client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (isNotUser(newMessage)) return;
    if (isNotInGuild(newMessage)) return;

    // reaction command
    const isReaction = await reaction(newMessage);
    if (isReaction) return;
  });

  ////////////guild member remove////////////
  client.on('guildMemberRemove', async member => {    
    // leave command
    sendMsg(LOG_CHANNEL_ID, `退出: ${member.user.tag}`);
  })

  ////////////DM message////////////
  client.on('messageCreate', async message => {
    if (isNotUser(message)) return;
    if (!isNotInGuild(message)) return;
    
    const isCharaMessage = await charaMessage(message);
    if (isCharaMessage) return;

    const text = `${message.author.username}:\n${message.content}`;
    sendDM(CHIEF_ADMIN_ID, text);
  });
}

export { eventListener };
import { rolePanel } from './button/rolePanel.js';

const buttons = {
  rp: rolePanel
};

async function executeButton(interaction) {
  if (!interaction.customId.startsWith('d')) return;
  
  try {
    const params = new URLSearchParams(interaction.customId);
    await buttons[params.get('d')](interaction, params);
    return;
  } catch (error) {
    console.error(error);
    interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
  }

}

export { executeButton };
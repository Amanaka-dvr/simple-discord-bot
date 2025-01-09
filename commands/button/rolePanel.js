import discord from 'discord.js';

async function handleError(err, { interaction, role_id, role_mention }) {
  if (err instanceof discord.DiscordAPIError) {
    switch (err.code) {
      case 10011:
        await interaction.followUp(`役職の付与に失敗しました。\n付与しようとした役職(id: \`${role_id}\`)は存在しません。\n(サーバ管理者へ連絡してください。)`);
        return;
      case 50013:
        await interaction.followUp(
          `${role_mention}の付与に失敗しました。\nBotに十分な権限がありません。\n(サーバ管理者へ連絡してください。)`,
        );
        return;
    }
  }
  interaction.followUp(`${role_mention}の付与に失敗しました。\n時間をおいてやり直してください。`).catch(() => { });
  throw err;
}

async function rolePanel(interaction, params) {
  const role_id = params.get('rid');
  await interaction.deferReply({
    ephemeral: true
  });
  const guild = await interaction.guild.fetch();
  const member = await guild.members.fetch(interaction.member.user.id, {
    force: true
  });
  const role_mention = `<@&${role_id}>`;
  if (member.roles.resolve(role_id)) {
    await interaction.followUp(`すでに、${role_mention}を持っています。`);
    return;
  }
  try {
    await member.roles.add(role_id);
  } catch (err) {
    await handleError(err, { interaction, role_id, role_mention });
    return;
  }
  await interaction.followUp({
    content: `${role_mention} を付与しました。`
  });
}

export { rolePanel };
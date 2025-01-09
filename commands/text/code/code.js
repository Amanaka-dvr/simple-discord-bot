import {
  sendReply,
  sendMsg 
} from '../../../util.js';

const gameState = {
  player1: { number: '', name: '', ready: false },
  player2: { number: '', name: '', ready: false },
  currentTurn: 1,
  ongoing: false,
};

function isValidNumber(number) {
  if (number.length !== 3 || isNaN(number)) return false;
  const digits = number.split('');
  return new Set(digits).size === 3;
}

function compareNumbers(guess, target) {
  let hits = 0;
  let blows = 0;

  for (let i = 0; i < 3; i++) {
    if (guess[i] === target[i]) {
      hits++;
    } else if (target.includes(guess[i])) {
      blows++;
    }
  }

  return `H${hits} B${blows}`;
}

async function code(message) {
  if (!message.content.match('!code')) return false;

  if (message.content.match('!code start')) {
    if (gameState.ongoing) {
      const text = 'ゲームは既に進行中です！';
      sendReply(message, text);
      return true;
    }

    gameState.player1 = { number: '', name: '', ready: false };
    gameState.player2 = { number: '', name: '', ready: false };
    gameState.currentTurn = 1;
    gameState.ongoing = true;

    const text = '暗号ゲームを開始します！各プレイヤーは任意の3桁の番号を設定してください。\n`!code set <番号>`を使って**重複する数字のない**番号を設定してください。';
    sendMsg(message.channel.id, text);
    
    return true;
  }

  // 番号設定
  if (message.content.match('!code set')) {
    if (!gameState.ongoing) {
      const text = 'ゲームは開始されていません！まず`!code start`で開始してください。';
      sendReply(message, text);
      return true;
    }

    const number = message.content.split(' ')[2];
    if (!isValidNumber(number)) {
      const text = '無効な番号です！重複する数字のない3桁の番号を設定してください。';
      sendReply(message, text);
      return true;
    }

    const player = gameState.player1.ready ? gameState.player2 : gameState.player1;
    const opponent = gameState.player1.ready ? gameState.player1 : gameState.player2;
    if (player.ready || opponent.name === message.member.displayName) {
      const text = 'すでに番号を設定しています！';
      sendReply(message, text);
      return true;
    }

    player.number = number;
    player.name = message.member.displayName;
    player.ready = true;

    const text = `${player.name} さんが番号を設定しました！`;
    sendMsg(message.channel.id, text);

    if (gameState.player1.ready && gameState.player2.ready) {
      const text = '両プレイヤーの番号が設定されました！ゲームを開始します。\n`!code guess <3桁の数字>`で推測してください。';
      sendMsg(message.channel.id, text);
    }

    return true;
  }

  // 推測
  if (message.content.match('!code guess')) {
    if (!gameState.ongoing) {
      const text = 'ゲームは開始されていません！まず`!code start`で開始してください。';
      sendReply(message, text);
      return true;
    }

    if (!gameState.player1.ready || !gameState.player2.ready) {
      const text = 'まだ両プレイヤーの番号が設定されていません！';
      sendReply(message, text);
      return true;
    }

    const guess = message.content.split(' ')[2];
    if (!isValidNumber(guess)) {
      const text = '無効な推測です！3桁の重複しない数字を入力してください。';
      sendReply(message, text);
      return true;
    }

    const currentPlayer = gameState.currentTurn === 1 ? gameState.player1 : gameState.player2;
    const opponent = gameState.currentTurn === 1 ? gameState.player2 : gameState.player1;

    if (message.member.displayName !== currentPlayer.name) {
      const text = `${currentPlayer.name} さんのターンです！`;
      sendReply(message, text);
      return true;
    }

    const result = compareNumbers(guess, opponent.number);
    const text = `${currentPlayer.name} さんの推測: ${guess} -> 結果: ${result}`;
    sendMsg(message.channel.id, text);

    if (result === 'H3 B0') {
      const text =
        `${currentPlayer.name} さんが勝利しました！`
        + `\n${gameState.player1.name} さんの番号: ${gameState.player1.number}`
        + `\n${gameState.player2.name} さんの番号: ${gameState.player2.number}`;
      sendMsg(message.channel.id, text);
      gameState.ongoing = false;
    } else {
      gameState.currentTurn = gameState.currentTurn === 1 ? 2 : 1;
      const nextPlayer = gameState.currentTurn === 1 ? gameState.player1 : gameState.player2;
      const text = `次は ${nextPlayer.name} さんのターンです！`;
      sendMsg(message.channel.id, text);
    }

    return true;
  }

  // リセット
  if (message.content.match('!code reset')) {
    gameState.ongoing = false;
    const text = 'ゲームがリセットされました。`!code start`で新しいゲームを始めてください。';
    sendMsg(message.channel.id, text);
  
    return true;
  }

  return false;
}

export { code };

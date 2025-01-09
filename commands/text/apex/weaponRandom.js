import {
  sendReply,
  randomInt
} from '../../../util.js';

const hardUser = [
  '464354759881523211'
]
const veryHardUser = [
  '852923175406141460'
]

const weaponsTableNormal = [
  'ヘムロック', //1
  'フラットライン', //2
  'ハボック', //3
  'R301', //4
  'プラウラー', //5
  'ボルト', //6
  'R99', //7
  'オルタネーター', //8
  'CAR', //9
  'スピットファイア', //10
  'L-STAR', //11
  'ディボーション', //12
  'ランページ', //13
  'クレーバー', //14
  'チャージライフル', //15
  'センチネル', //16
  'ロングボウ', //17
  'ピースキーパー', //18
  'モザンビーク', //19
  'マスティフ', //20
  'EVA-8', //21
  'ウイングマン', //22
  'RE-45', //23
  'P2020', //24
  'トリプルテイク', //25
  'G7スカウト', //26
  '30-30リピーター', //27
  'ボセック', //28
  'ミニガン', //29
  '改造センチネル', //30
  'アークスター', //31
  'フラググレネード', //32
  'テルミット', //33
  '素手' //34
];
const weaponsTableHard = [
  'ディボーション', //1
  'ランページ', //2
  'クレーバー', //3
  'チャージライフル', //4
  'センチネル', //5
  'ロングボウ', //6
  'マスティフ', //7
  'P2020', //8
  'トリプルテイク', //9
  '30-30リピーター', //10
  'ボセック', //11
  'ミニガン', //12
  '改造センチネル', //13
  'アークスター', //14
  'フラググレネード', //15
  'テルミット', //16
  '素手' //17
];
const weaponsTableVeryHard = [
  'ディボーション', //1
  'ランページ', //2
  'クレーバー', //3
  'チャージライフル', //4
  'P2020', //5
  'トリプルテイク', //6
  'ボセック', //7
  'ミニガン', //8
  '改造センチネル', //9
  'アークスター', //10
  'フラググレネード', //11
  'テルミット', //12
  '素手' //13
];

async function weaponRandom(message) {
  if (!message.content.match(/!apex武器縛り/)) return false;

  let randoms = [];
  let weapons = weaponsTableNormal;

  if (hardUser.includes(message.author.id)) {
    weapons = weaponsTableHard;
  }

  if (veryHardUser.includes(message.author.id)) {
    weapons = weaponsTableVeryHard;
  }

  const min = 0;
  const max = weapons.length - 1;

  /* //if you don't want to duplicate
  for (let i = min; i <= max; i++) {
    let tmp = randomInt(min, max);
    while(!randoms.includes(tmp)){
      tmp = randomInt(min, max);
    }
    randoms.push(tmp);
  }
  //*/

  for (let i = 1; i <= 4; i++) {
    randoms.push(randomInt(min, max));
  }

  const val1 = randoms[0];
  const val2 = randoms[1];
  const val3 = randoms[2];
  const val4 = randoms[3];
  const text = `<@${message.author.id}>の使用可能な武器は、${weapons[val1]}、${weapons[val2]}、${weapons[val3]}、${weapons[val4]}です。`;
  sendReply(message, text);
  return true;
}

export { weaponRandom };
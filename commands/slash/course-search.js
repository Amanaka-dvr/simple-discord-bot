import { SlashCommandBuilder } from 'discord.js';
import { 
  readJson
} from '../../util.js';

const FILE_PATH = './uma_course.json';

export default {
	data: new SlashCommandBuilder()
		.setName('course-search')
		.setDescription('ウマ娘実装コース情報の検索をします。')
    .addStringOption(option =>
      option
        .setName('course')
        .setDescription('レース場を指定してください。')
        .setRequired(false) 
        .addChoices(
          {name:'札幌', value: '札幌'},
          {name:'函館', value: '函館'},
          {name:'新潟', value: '新潟'},
          {name:'福島', value: '福島'},
          {name:'中山', value: '中山'},
          {name:'東京', value: '東京'},
          {name:'中京', value: '中京'},
          {name:'京都', value: '京都'},
          {name:'阪神', value: '阪神'},
          {name:'小倉', value: '小倉'},
          {name:'大井', value: '大井'},
          {name:'川崎', value: '川崎'},
          {name:'船橋', value: '船橋'},
          {name:'盛岡', value: '盛岡'},
          {name:'ロンシャン', value: 'ロンシャン'},
          {name:'サンタアニタパーク', value: 'サンタアニタパーク'},
        )
    )
    .addStringOption(option =>
      option
        .setName('track')
        .setDescription('バ場を指定してください。')
        .setRequired(false) 
        .addChoices(
          {name:'芝', value: '芝'},
          {name:'ダート', value: 'ダート'}
        )
    )
    .addStringOption(option =>
      option
        .setName('distance')
        .setDescription('距離を指定してください。')
        .setRequired(false) 
        .addChoices(
          {name:'短距離', value: '短距離'},
          {name:'マイル', value: 'マイル'},
          {name:'中距離', value: '中距離'},
          {name:'長距離', value: '長距離'}
        )
    )
    .addStringOption(option =>
      option
        .setName('long')
        .setDescription('長さを指定してください。')
        .setRequired(false) 
        .addChoices(
          {name:'根幹距離', value: 'root'},
          {name:'非根幹距離', value: 'non-root'}
        )
    )
    .addStringOption(option =>
      option
        .setName('direction')
        .setDescription('回り方向を指定してください。')
        .setRequired(false) 
        .addChoices(
          {name:'右', value: '右'},
          {name:'左', value: '左'},
          {name:'なし', value: 'なし'}
        )
    )
    .addStringOption(option =>
      option
        .setName('side')
        .setDescription('回り側を指定してください。')
        .setRequired(false) 
        .addChoices(
          {name:'内', value: '内'},
          {name:'外', value: '外'},
          {name:'なし', value: 'なし'}
        )
    )
    .addStringOption(option =>
      option
        .setName('runable')
        .setDescription('ルームマッチ条件で調べる場合は指定してください。')
        .setRequired(false) 
        .addChoices(
          {name:'ルームマッチで設定可能なコースのみ', value: 'true'}
        )
    ),
	async execute(interaction) {
    const coursejson = await readJson(FILE_PATH);
    const courseData = coursejson.data;
    let filtered = courseData;
    
    const course = interaction.options.get("course");
    const track = interaction.options.get("track");
    const distance = interaction.options.get("distance");
    const long = interaction.options.get("long");
    const direction = interaction.options.get("direction");
    const side = interaction.options.get("side");
    const runable = interaction.options.get("runable");
    
    if (course) {
      filtered = filtered.filter(data => data.course === course.value);
    }
    if (track) {
      filtered = filtered.filter(data => data.track === track.value);
    }
    if (distance) {
      filtered = filtered.filter(data => data.distance === distance.value);
    }
    if (long) {
      if (long.value === "root") {
        filtered = filtered.filter(data => data.long % 400 === 0);
      } else {
        filtered = filtered.filter(data => data.long % 400 !== 0);
      }
    }
    if (direction) {
      filtered = filtered.filter(data => data.direction === direction.value);
    }
    if (side) {
      filtered = filtered.filter(data => data.side.includes(side.value));
    }
    if (runable) {
      filtered = filtered.filter(data => data.entries !== 0);
    }
    
    if (filtered.length === 0) {
      return interaction.reply({ content: "条件に一致するコースは見つかりませんでした。", ephemeral: true });
    } else {
      let message = "条件に一致するコースは以下の通りです。\n";
      filtered.forEach(data => {
        message += `${data.course}`;
        message += `　${data.track}`;
        message += `　${data.long}`;
        message += `(${data.distance})`;
        message += `　${data.direction}`;
        message += `・${data.side}`;
        message += "\n";
      });
      return interaction.reply({ content: message, ephemeral: true });
    }
	}
};
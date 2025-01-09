import { EmbedBuilder } from 'discord.js';
import axiosBase from 'axios';

const AUTH_KEY = process.env.DEEPL_AUTH_KEY;
const DEFAULT_LANG = 'JA';

async function translate(message) {
  if (!message.channel.topic) return false;

  const translationConfig = message.channel.topic.trim().match(/deepl-translate\((.+)\)/);
  if (!translationConfig) return true;

  const targetLang = translationConfig[1];
  if (!targetLang) return true;

  const post = (message, lang) => {
    return axiosBase.post('https://api-free.deepl.com/v2/translate?' +
      'auth_key=' + AUTH_KEY + '&' +
      'text=' + encodeURIComponent(message) + '&' +
      'target_lang=' + lang);
  }

  const send = (message, translations) => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
      .setColor(0xff0000)
      .setDescription(
        translations.map(t => {
          let text = '`' + t.lang + ':` ' + t.translations[0].text;
          if (t.translations.length > 1) {
            text += ' (';
            text += t.translations.slice(1).map(others =>
              (others.detected_source_language + ': ' + others.text))
              .join(', ');
            text += ')';
          }
          return text;
        })
          .join('\n'));
    message.channel.send({ embeds: [embed] });
  }

  post(message.content, targetLang)
    .then(response => {
      if (
        response.data.translations.length === 1
        && response.data.translations[0].detected_source_language === targetLang
      ) {
        post(message.content, DEFAULT_LANG)
          .then(retry => {
            send(message, [{ lang: DEFAULT_LANG, translations: retry.data.translations }]);
          });
      } else if (
        response.data.translations.length === 1
        && response.data.translations[0].detected_source_language === DEFAULT_LANG
      ) {
        send(message, [{ lang: targetLang, translations: response.data.translations }]);
      } else {
        post(message.content, DEFAULT_LANG)
          .then(retry => {
            send(message,
              [
                {
                  lang: targetLang,
                  translations: response.data.translations
                },
                {
                  lang: DEFAULT_LANG,
                  translations: retry.data.translations
                }
              ]);
          });
      }
    });

  return true;
}

export { translate };
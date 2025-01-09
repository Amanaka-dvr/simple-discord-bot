import {
  sendReply,
  readJson,
  randomInt
} from '../../../util.js';

const FILE_PATH = './uma_course.json';

async function courseRandom(message) {
  if (!message.content.match(/!コース/)) return false;

  const coursejson = await readJson(FILE_PATH);
  const courseData = coursejson.data.filter(e => e.entries !== 0);
  const len = courseData.length;
  const regexpAll = /全/;
  const regexpDistance = /距離/;
  const regexpTurf = /芝/;

  let randomCourseData = {};
  if (message.content.match(regexpAll)) {
    let randVal = randomInt(1, len);
    randomCourseData = courseData.find(({ id }) => id === randVal);
  } else if (message.content.match(regexpDistance)) {
    const distanceArray = ['短距離', 'マイル', '中距離', '長距離'];
    let randDist = randomInt(0, 3);

    const filteredData = courseData.filter(({ distance }) => distance === distanceArray[randDist]);
    const lenFiltered = filteredData.length;

    let randVal = randomInt(0, lenFiltered - 1);
    randomCourseData = filteredData[randVal];
  } else if (message.content.match(regexpTurf)) {
    const turf = '芝';

    const filteredData = courseData.filter(({ track }) => track === turf);
    const lenFiltered = filteredData.length;

    let randVal = randomInt(0, lenFiltered - 1);
    randomCourseData = filteredData[randVal];
  } else {
    let randVal = randomInt(1, len);
    randomCourseData = courseData.find(({ id }) => id === randVal);
  }

  const text = `選ばれたコースは\n${randomCourseData.course}　${randomCourseData.track}　${randomCourseData.long}(${randomCourseData.distance})　${randomCourseData.direction}・${randomCourseData.side}\nだ！`;
  sendReply(message, text);

  return true;
}

export { courseRandom };
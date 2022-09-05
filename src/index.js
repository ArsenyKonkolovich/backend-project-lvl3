import axios from 'axios';
// import os from 'os';
import fsp from 'fs/promises';
import path from 'path';

const loadHtmlPage = (filePath, url) => {
  console.log(`${filePath}.html`);
  axios.get(url)
    .then(({ data }) => fsp.writeFile(`${filePath}.html`, data))
    .catch((e) => { throw new Error(e); });
};

// const extractImageLinks = (data) => {
//   const regexp = /(?<=src=)".*?"/;

// }

// const loadImage = (filePath, url) => {
//   const dirPath = `${filePath}_files`;
//   return fsp.readFile(filePath)
//   .then((data) => )
// };

const downloadPage = (filePath, url) => {
  const fileName = url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');
  const resultPath = path.join(filePath, fileName);
  return fsp.mkdir(`${resultPath}_files`, { recursive: true })
    .catch((e) => { throw new Error(e); })
    .then(() => loadHtmlPage(resultPath, url))
    .catch((e) => { throw new Error(e); });
};

// downloadPage(path.join(os.tmpdir()), 'https://ru.hexlet.io/courses');

export default downloadPage;

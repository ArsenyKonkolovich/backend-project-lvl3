import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';

const loadHtmlPage = (url, filePath, fileName) => {
  const resulFilePath = `${filePath}_files`;
  return axios.get(url)
    .then(({ data }) => fsp.writeFile(path.join(resulFilePath, `${fileName}.html`), data))
    .catch((e) => { throw new Error(e); });
};

const downloadPage = (filePath, url) => {
  const fileName = url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');
  const resultPath = path.join(filePath, fileName);
  return fsp.mkdir(`${resultPath}_files`, { recursive: true })
    .catch((e) => { throw new Error(e); })
    .then(() => loadHtmlPage(url, resultPath, fileName))
    .catch((e) => { throw new Error(e); });
};

// downloadPage('blabla/', 'https://www.gmail.com');

export default downloadPage;

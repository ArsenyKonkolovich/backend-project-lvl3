import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const loadHtmlPage = (filePath, url) => axios.get(url)
  .then(({ data }) => fsp.writeFile(`${filePath}.html`, data))
  .catch((e) => { throw new Error(e); });

const loadImage = (filePath, url) => {
  const dirPath = `${filePath}_files`;
  const htmlFilePath = `${filePath}.html`;
  const imageLinks = [];
  return fsp.readFile(htmlFilePath)
    .then((data) => {
      const $ = cheerio.load(data);
      imageLinks.push($('img').attr('src'));
    })
    .catch((e) => { throw new Error(e); })
    .then(() => {
      imageLinks.forEach((link) => {
        const imageName = path.parse(link).base;
        axios.get(`${url}${link}`)
          .then(({ data }) => fsp.writeFile(path.join(dirPath, imageName), data));
      });
    });
};

const downloadPage = (filePath, url) => {
  const fileName = url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');
  const resultPath = path.join(filePath, fileName);
  return fsp.mkdir(`${resultPath}_files`, { recursive: true })
    .catch((e) => { throw new Error(e); })
    .then(() => loadHtmlPage(resultPath, url))
    .catch((e) => { throw new Error(e); })
    .then(() => loadImage(`${resultPath}`, url))
    .catch((e) => { throw new Error(e); })
    .then(() => console.log('Done!'));
};

// downloadPage('blabla', 'https://www.google.com');

export default downloadPage;

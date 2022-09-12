import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const nameChanger = (url) => url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');

const normalizeName = (url, resourseUrl) => {
  const nameForChange = `${path.parse(resourseUrl).dir}/${path.parse(resourseUrl).name}`;
  const nameWhithOutExt = nameChanger(`${url}${nameForChange}`);
  return `${nameWhithOutExt}${path.parse(resourseUrl).ext}`;
};

const loadHtmlPage = (filePath, url, fileName) => {
  const dirName = `${fileName}_files`;
  const dirPath = `${filePath}_files`;
  const htmlFilePath = `${filePath}.html`;
  let imageLinks = [];
  let $;
  return axios.get(url)
    .then(({ data }) => {
      $ = cheerio.load(data);
      imageLinks = $('img').toArray();
      imageLinks.forEach((link) => {
        const imageLink = $(link).attr('src');
        // console.log(normalizeName(url, imageLink));
        const imageName = normalizeName(url, imageLink);
        axios.get(`${url}${imageLink}`)
          // eslint-disable-next-line no-shadow
          .then(({ data }) => fsp.writeFile(path.join(dirPath, imageName), data))
          .catch((e) => { throw new Error(e); });
        $(link).attr('src', `${dirName}/${imageName}`);
      });
    })
    .catch((e) => { throw new Error(e); })
    .then(() => fsp.writeFile(htmlFilePath, $.html()));
};

const downloadPage = (filePath, url) => {
  const fileName = nameChanger(url);
  const resultPath = path.join(filePath, fileName);
  return fsp.mkdir(`${resultPath}_files`, { recursive: true })
    .catch((e) => { throw new Error(e); })
    .then(() => loadHtmlPage(`${resultPath}`, url, fileName))
    .catch((e) => { throw new Error(e); })
    .then(() => console.log('Done!'));
};

// downloadPage('blabla', 'https://www.google.com');
// const $elements = $(tagName).toArray();
// $elements.forEach(($element) => $element.attr(attrName, value));

export default downloadPage;

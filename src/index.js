import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

// const loadHtmlPage = (filePath, url) => axios.get(url)
//   .then(({ data }) => fsp.writeFile(`${filePath}.html`, data))
//   .catch((e) => { throw new Error(e); });

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
        console.log($(link).attr('src'));
        const imageLink = $(link).attr('src');
        const imageName = path.parse(imageLink).base;
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
  const fileName = url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');
  const resultPath = path.join(filePath, fileName);
  return fsp.mkdir(`${resultPath}_files`, { recursive: true })
    .catch((e) => { throw new Error(e); })
    // .then(() => loadHtmlPage(resultPath, url))
    // .catch((e) => { throw new Error(e); })
    .then(() => loadHtmlPage(`${resultPath}`, url, fileName))
    .catch((e) => { throw new Error(e); })
    .then(() => console.log('Done!'));
};

// downloadPage('blabla', 'https://www.google.com');
// const $elements = $(tagName).toArray();
// $elements.forEach(($element) => $element.attr(attrName, value));

export default downloadPage;

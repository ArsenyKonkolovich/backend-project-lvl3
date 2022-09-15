import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const mapping = {
  img: 'src',
  script: 'src',
  link: 'href',
};

const nameChanger = (url) => url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');

const normalizeName = (url) => {
  console.log(url);
  const nameForChange = `${path.parse(url.href).dir}/${path.parse(url.href).name}`;
  const nameWhithOutExt = nameChanger(nameForChange);
  const resultName = `${nameWhithOutExt}${path.parse(url.href).ext}`;
  // console.log('nameForChange', nameForChange);
  // console.log('nameWhithOutExt', nameWhithOutExt);
  // console.log('resultName', resultName);
  return resultName;
};

const isDownloadable = (src, link) => {
  const srcUrl = new URL(src, link);
  const pageUrl = new URL(link);
  return srcUrl.origin === pageUrl.origin;
};

const loadHtmlPage = (filePath, url, fileName) => {
  const dirName = `${fileName}_files`;
  const dirPath = `${filePath}_files`;
  const htmlFilePath = `${filePath}.html`;
  let srcinks = [];
  let $;
  const tagNames = Object.keys(mapping);
  return axios.get(url)
    .then(({ data }) => {
      $ = cheerio.load(data);
      tagNames.forEach((tagName) => {
        const attrName = mapping[tagName];
        srcinks = $(tagName).toArray();
        srcinks.forEach((link) => {
          if (isDownloadable(link, url)) {
            const srcLink = $(link).attr(attrName);
            console.log(srcLink.href);
            const downloadLink = new URL(srcLink, url);
            const srcName = normalizeName(downloadLink);
            axios.get(`${url}${srcLink}`)
            // eslint-disable-next-line no-shadow
              .then(({ data }) => fsp.writeFile(path.join(dirPath, srcName), data))
              .catch((e) => { throw new Error(e); });
            $(link).attr(attrName, `${dirName}/${srcName}`);
          }
        });
      });
    })
    .catch((e) => { throw new Error(e); })
    .then(() => {
      fsp.writeFile(htmlFilePath, $.html());
    });
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
// downloadPage('blabla', 'https://www.elbrusboot.camp');

export default downloadPage;

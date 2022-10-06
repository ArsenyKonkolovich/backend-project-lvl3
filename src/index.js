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
  const nameForChange = `${path.parse(url.href).dir}/${path.parse(url.href).name}`;
  const nameWhithOutExt = nameChanger(nameForChange);
  const resultName = `${nameWhithOutExt}${path.parse(url.href).ext}`;
  return resultName;
};

const isDownloadable = (src, url) => {
  const srcUrl = new URL(src, url);
  const pageUrl = new URL(url);
  return srcUrl.origin === pageUrl.origin;
};

const normalizeLink = (srcLink, url) => {
  console.log(typeof srcLink);
  const hostName = new URL(url).hostname;
  if (srcLink.includes(hostName)) {
    return new URL(srcLink, url);
  }
  return new URL(`${url}${srcLink}`);
};

const loadHtmlPage = (filePath, url, fileName) => {
  const dirName = `${fileName}_files`;
  const dirPath = `${filePath}_files`;
  const htmlFilePath = `${filePath}.html`;
  let srcLinks = [];
  let $;
  const tagNames = Object.keys(mapping);
  return axios.get(url)
    .then(({ data }) => {
      $ = cheerio.load(data);
      tagNames.forEach((tagName) => {
        const attrName = mapping[tagName];
        srcLinks = $(tagName).toArray();
        srcLinks.forEach((link) => {
          const srcLink = $(link).attr(attrName);
          if (srcLink && isDownloadable(srcLink, url)) {
            console.log(srcLinks);
            const downloadLink = normalizeLink(srcLink, url);
            console.log(url, srcLink);
            console.log(downloadLink.href);
            const srcName = normalizeName(downloadLink);
            axios.get(downloadLink.href)
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
// downloadPage('blabla', 'https://www.ya.ru');
// downloadPage('blabla', 'https://ru.hexlet.io/courses');

export default downloadPage;

import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import axiosDebug from 'axios-debug-log';
import debug from 'debug';
import Listr from 'listr';
import { nameChanger, normalizeName, isDownloadable } from './util.js';

const log = debug('page-loader');

const mapping = {
  img: 'src',
  script: 'src',
  link: 'href',
};

axiosDebug({
  request(httpDebug, config) {
    httpDebug(`Request ${config.url}`);
  },
  response(httpDebug, response) {
    httpDebug(
      `Response with ${response.headers['content-type']}`,
      `from ${response.config.url}`,
    );
  },
});

const loadResourses = (filePath, url, fileName) => {
  const dirName = `${fileName}_files`;
  const dirPath = `${filePath}_files`;
  const htmlFilePath = `${filePath}.html`;
  let srcLinks = [];
  let $;
  let linkForTasks;
  const tagNames = Object.keys(mapping);
  return axios.get(url)
    .then(({ data }) => {
      $ = cheerio.load(data);
      tagNames.forEach((tagName) => {
        const attrName = mapping[tagName];
        srcLinks = $(tagName).toArray();
        const tasks = new Listr(srcLinks
          .forEach((link) => {
            const srcLink = $(link).attr(attrName);
            if (srcLink && isDownloadable(srcLink, url)) {
              const downloadLink = new URL(srcLink, url);
              linkForTasks = downloadLink;
              const srcName = normalizeName(downloadLink);
              log(`Filename is ${srcName}`);
              axios.get(downloadLink.href)
              // eslint-disable-next-line no-shadow
                .then(({ data }) => fsp.writeFile(path.join(dirPath, srcName), data));
              log(`Download resourse from ${downloadLink.href}`);
              $(link).attr(attrName, `${dirName}/${srcName}`);
            }
            return { title: linkForTasks, task: () => tasks };
          }));
        return tasks.run();
      });
    })
    .then(() => {
      log(`HTML filepath is ${htmlFilePath}`);
      console.log(`Page was succsessfully download into ${htmlFilePath}`);
      return fsp.writeFile(htmlFilePath, $.html());
    });
};

const downloadPage = (filePath, url) => {
  const fileName = nameChanger(url);
  const resultPath = path.join(filePath, fileName);
  return fsp.mkdir(`${resultPath}_files`, { recursive: true })
    .then(() => loadResourses(`${resultPath}`, url, fileName))
    .catch((error) => {
      console.error(`Sorry, download error: ${error.message} ${error.code}`);
      throw error;
    });
};

// downloadPage('blabla', 'https://www.google.com');
// downloadPage('blabla', 'https://ru.hexlet.io/courses');

export default downloadPage;

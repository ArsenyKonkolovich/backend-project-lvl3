/* eslint-disable no-shadow */
import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import axiosDebug from 'axios-debug-log';
import debug from 'debug';
import Listr from 'listr';
// import { link } from 'fs';
import {
  nameChanger, normalizeName, getResoursesLinks, localizeLinks,
} from './util.js';

const log = debug('page-loader');

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
  const resourcesToLocalize = [];
  let $;
  return axios.get(url)
    .then(({ data }) => {
      $ = cheerio.load(data);
      const linkForDownload = getResoursesLinks($, url);
      if (linkForDownload.length === 0) {
        console.error('No resourses for download');
        process.exit(1);
      }
      const tasks = new Listr(
        linkForDownload.map((link) => {
          const downloadLink = new URL(link, url);
          const srcName = normalizeName(downloadLink);
          const relativePath = `${dirName}/${srcName}`;
          resourcesToLocalize.push([link, relativePath]);
          log(`Filename is ${srcName}`);
          const task = axios.get(downloadLink.href)
            .then(({ data }) => fsp.writeFile(path.join(dirPath, srcName), data));
          log(`Download resourse from ${downloadLink.href}`);
          return { title: link, task: () => task };
        }),
      );
      return tasks.run();
    })
    .then(() => {
      localizeLinks($, resourcesToLocalize);
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

export default downloadPage;

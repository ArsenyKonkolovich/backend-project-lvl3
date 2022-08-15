/* eslint-disable no-undef */
// import axios from 'axios';
import os from 'os';
import nock from 'nock';
// import { fileURLToPath } from 'url';
import path from 'path';
import fsp from 'fs/promises';
import downloadPage from '../src/index.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const tmpFilePath = path.join(os.tmpdir());
// const getFixturePath = (name) => path.join(__dirname, '..', '__fixtures__', name);
// const readFile = (dir, file) => fsp.readFile(path.join(dir, file));
// const getPath = (dirname, filename) => path.join(dirname, filename);

// let data;
const actualData = 'data';

nock.disableNetConnect();

// beforeAll(async () => {
//   data = await fsp.readFile(getFixturePath('ru-hexlet-io-courses.html'));
// });

afterAll(() => {
  fsp.unlink(path.join(tmpFilePath, 'ru-hexlet-io-courses.html'));
});

test('Download page', async () => {
  nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, actualData);
  const actual = actualData;
  await downloadPage(tmpFilePath, 'https://ru.hexlet.io/courses');
  const expected = await fsp.readFile(path.join(tmpFilePath, 'ru-hexlet-io-courses.html'));
  console.log(expected);
  expect(expected).toEqual(actual);
});

test('Path not exist', async () => {
  nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, 'data');
  // const expected1 = await downloadPage('blablabla', 'https://ru.hexlet.io/courses');
  // console.log('EXPECTED 1', expected1);
  expect(await downloadPage('blablabla', 'https://ru.hexlet.io/courses')).toThrow();
});

/* eslint-disable no-undef */
// import axios from 'axios';
import os from 'os';
// import nock from 'nock';
import { fileURLToPath } from 'url';
import path from 'path';
import fsp from 'fs/promises';
import downloadPage from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmpFilePath = path.join(os.tmpdir());
const getFixturePath = (name) => path.join(__dirname, '..', '__fixtures__', name);
// const readFile = (dir, file) => fsp.readFile(path.join(dir, file));
// const getPath = (dirname, filename) => path.join(dirname, filename);

let data;

beforeAll(async () => {
  data = await fsp.readFile(getFixturePath('ru-hexlet-io-courses.html'));
});

test('Download page', async () => {
//   nock(/ru\.hexlet\.io/)
//     .get(/courses/)
//     .reply(200, data);
  const actual = data;
  await downloadPage(tmpFilePath, 'https://ru.hexlet.io/courses');
  const expected = await fsp.readFile(path.join(tmpFilePath, 'ru-hexlet-io-courses.html'));
  expect(expected).toEqual(actual);
});

test('Downloading page', async () => {
  const expected1 = downloadPage('blablabla', 'https://ru.hexlet.io/courses');
  expect(expected1).toThrow();
});

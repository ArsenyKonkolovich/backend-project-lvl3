/* eslint-disable no-undef */
import os from 'os';
import nock from 'nock';
import { fileURLToPath } from 'url';
import path from 'path';
import fsp from 'fs/promises';
import downloadPage from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmpFilePath = path.join(os.tmpdir());
const getFixturePath = (name) => path.join(__dirname, '..', '__fixtures__', name);
const getTmpFilePath = path.join(tmpFilePath, 'ru-hexlet-io-courses_files', 'ru-hexlet-io-courses.html');

let data;

nock.disableNetConnect();

beforeAll(async () => {
  data = await fsp.readFile(path.join(getFixturePath('ru-hexlet-io-courses_files'), 'ru-hexlet-io-courses.html'), 'utf-8');
});

afterAll(() => {
  fsp.unlink(getTmpFilePath);
});

test('Download page', async () => {
  nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, data);
  const actual = data;
  await downloadPage(tmpFilePath, 'https://ru.hexlet.io/courses');
  const expected = await fsp.readFile(getTmpFilePath, 'utf-8');
  expect(expected).toEqual(actual);
});

// test('Path not exist', async () => {
//   nock(/ru\.hexlet\.io/)
//     .get(/\/courses/)
//     .reply(200, 'data');
//   expect(async () => { await downloadPage('blablabla', 'https://ru.hexlet.io/courses'); }).rejects.toThrow();
// });

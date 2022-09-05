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

let data;

nock.disableNetConnect();

beforeAll(async () => {
  data = await fsp.readFile(path.join(getFixturePath('ru-hexlet-io-courses_files'), 'ru-hexlet-io-courses.html'), 'utf-8');
});

afterAll(() => {
  fsp.unlink(path.join(tmpFilePath, 'ru-hexlet-io-courses.html'));
});

test('Download page', async () => {
  nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, data);
  const actual = data;
  await downloadPage(tmpFilePath, 'https://ru.hexlet.io/courses');
  const expected = await fsp.readFile(path.join(tmpFilePath, 'ru-hexlet-io-courses.html'), 'utf-8');
  expect(expected).toEqual(actual);
});

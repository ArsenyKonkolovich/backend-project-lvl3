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
let changeData;
let imagedata;

nock.disableNetConnect();

beforeAll(async () => {
  data = await fsp.readFile(path.join(getFixturePath('ru-hexlet-io-courses_files'), 'ru-hexlet-io-courses.html'), 'utf-8');
  imagedata = await fsp.readFile(path.join(getFixturePath('ru-hexlet-io-courses_files'), 'ru-hexlet-io-assets-professions-nodejs.png'), 'utf-8');
  changeData = await fsp.readFile(path.join(getFixturePath('ru-hexlet-io-courses.html')), 'utf-8');
});

afterAll(async () => {
  await fsp.unlink(path.join(tmpFilePath, 'ru-hexlet-io-courses.html'));
  await fsp.rm(path.join(tmpFilePath, 'ru-hexlet-io-courses_files'), { recursive: true, force: true });
});

test('Download page', async () => {
  nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, data)
    .get(/\/courses\/assets\/professions\/nodejs\.png/)
    .reply(200, imagedata);
  const actual = changeData;
  await downloadPage(tmpFilePath, 'https://ru.hexlet.io/courses');
  const expected = await fsp.readFile(path.join(tmpFilePath, 'ru-hexlet-io-courses.html'), 'utf-8');
  expect(expected).toEqual(actual);
});

test('Download image', async () => {
  nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, data)
    .get(/\/courses\/assets\/professions\/nodejs\.png/)
    .reply(200, imagedata);
  const actual = imagedata;
  await downloadPage(tmpFilePath, 'https://ru.hexlet.io/courses');
  const expected = await fsp.readFile(path.join(tmpFilePath, 'ru-hexlet-io-courses_files', 'ru-hexlet-io-assets-professions-nodejs.png'), 'utf-8');
  expect(expected).toEqual(actual);
});

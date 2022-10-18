import path from 'path';

// const module = 'page-loader: createFileName';
// const log = debug(module);

export const nameChanger = (url) => url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');

export const normalizeName = (url) => {
  const nameForChange = `${path.parse(url.href).dir}/${path.parse(url.href).name}`;
  const nameWhithOutExt = nameChanger(nameForChange);
  const resultName = `${nameWhithOutExt}${path.parse(url.href).ext}`;
  return resultName;
};

export const isDownloadable = (src, url) => {
  const srcUrl = new URL(src, url);
  const pageUrl = new URL(url);
  return srcUrl.origin === pageUrl.origin;
};

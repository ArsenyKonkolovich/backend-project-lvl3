import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';

const downloadPage = (filePath, url) => {
  const fileName = url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');
  const resultPath = path.join(filePath, fileName);
  return axios.get(url)
    .then(({ data }) => fsp.writeFile(`${resultPath}.html`, data))
    .catch((e) => { throw new Error(e); });
};

export default downloadPage;

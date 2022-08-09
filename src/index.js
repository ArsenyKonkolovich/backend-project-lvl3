import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';

export const downloadPage = (filePath, link) => {
  const fileName = link.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');
  const resultPath = path.join(filePath, fileName);
  axios.get(link)
    .then(({ data }) => fsp.writeFile(`${resultPath}.html`, data))
    .catch((e) => { throw new Error(e); });
};

const multiply = (num1, num2) => num1 * num2;

export default multiply;

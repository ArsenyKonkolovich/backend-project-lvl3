#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';

const program = new Command();

program
  .version('0.0.1', '-V, --version', 'output the version number')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir', '/home/user/current-dir');
//   .arguments('<filepath1>')
//   .arguments('<filepath2>')
//   .action((filepath1, filepath2) => {
//     const options = program.opts();
//     const diff = genDiff(filepath1, filepath2, options.format);
//     console.log(diff);
//   });
program.parse(process.argv);

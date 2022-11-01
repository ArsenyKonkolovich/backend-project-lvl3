#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';
import downloadPage from '../src/index.js';

const program = new Command();

program
  .version('0.0.1', '-V, --version', 'output the version number')
  .description('Page loader utility')
  .option('-o, --output [dir]', 'output dir', 'output dir (default: "/home/user/current-dir")')
  .arguments('<url>')
  .action((url) => {
    const options = program.opts();
    downloadPage(url, options.output);
  });
program.parse(process.argv);

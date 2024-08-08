import {fileURLToPath} from 'url';
import path from 'path';
import debugFunc from 'debug'
import {Chalk, chalkStderr, supportsColorStderr} from 'chalk';
import {CliTransformer} from './cliTransformer.js'
import {inspect} from "util";
import {parseArguments} from '@foo-dog/utils';
import * as fs from "node:fs";
import {Generator} from "./index.js";

const debug = debugFunc('generator')

const __filename = fileURLToPath(import.meta.url);

const chalk = new Chalk();

export function printUsage(console: Console = global.console): void {
  const help = [''];
  const p = (str?: string) => help.push(str ?? '')
  const b = (str: string) => help.push(chalk.bold(str))
  b("Generator")
  p('Reads a Foo-Dog AST and generates HTML')
  p()
  b('Usage')
  p(chalk.blue('node ' + path.basename(__filename) + ' [-h] [inFile] [outFile]'))
  p('inFile and outFile are both optional and will default to stdin and stdout if omitted.')
  p('You can also use "-" for inFile and outFile for their respective streams.')
  p()

  console.log(help.join('\n'))
}

const generator = new Generator()

export async function run(): Promise<void> {
  await parseArguments(process, printUsage).then(async (ret: any) => {
    const options = ret;
    try {
      // options.in.createStream()
      // .pipe(new CliTransformer(options.in.name === 'stdin'))
      // .pipe(options.out.createStream());

      // if (options.in.name == 'stdin') {
      //     let str = process.stdin.read();
      //     if (str != null && str !== '') {
      //       process.stdout.write(str)
      //       const obj = generator.fromString(str)
      //       const jsonString = JSON.stringify(obj, null, '  ');
      //       if (options.out == 'stdout') {
      //         process.stdout.write(jsonString)
      //       }
      //       else {
      //         fs.writeFileSync(options.out, jsonString)
      //       }

      //   }
      // }
      // else {
        const html = await generator.fromJson(JSON.parse(fs.readFileSync(options.in.name).toString('utf8')))
        if (options.out) {
          if (options.out.name == 'stdout') {
            process.stdout.write(html)
          }
          else {
            fs.writeFileSync(options.out.name, html)
          }
        }
      // }
    } catch (e: any) {
      if (supportsColorStderr) {
        console.error(chalkStderr(chalk.red(e.message) + chalk.cyan("\noptions:" + inspect(options, false, 3, true))))
      } else {
        console.error('*'.repeat(30) + '\n' + e.message, e)
      }
    }
  })
}
import {fileURLToPath} from 'url';
import path from 'path';
import debugFunc from 'debug'
import {Chalk, chalkStderr, supportsColorStderr} from 'chalk';
// import generator from './index.js'
import {CliTransformer} from './cliTransformer.js'
import {parseArguments} from '@foo-dog/utils'

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


export async function run(): Promise<void> {
  const options = await parseArguments(process, printUsage)
  try {
    options.in.createStream()
    .pipe(new CliTransformer(options.in.name === 'stdin'))
    .pipe(options.out.createStream());

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
    //   const html = generator.fromString(fs.readFileSync(options.in.name))
    //   if (options.out) {
    //     if (options.out.name == 'stdout') {
    //       process.stdout.write(html)
    //     }
    //     else {
    //       fs.writeFileSync(options.out.name, html)
    //     }
    //   }
    // }
  } catch (e: any) {
    if (supportsColorStderr) {
      console.error(chalkStderr(chalk.red(e.message)))
    } else {
      console.error('*'.repeat(30) + '\n' + e.message)
    }
    console.error(e)
  }
}
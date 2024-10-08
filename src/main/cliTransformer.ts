import {fileURLToPath} from 'url';
import debugFunc from 'debug'
import {Generator} from './index.js'
import stream, {TransformCallback} from 'stream'
import {inspect} from 'util';

const debug = debugFunc('generator.cliTransformer')
const __filename = fileURLToPath(import.meta.url);

const generator = new Generator()

export class CliTransformer extends stream.Transform {
  constructor(private stdin: any) {
    super({ decodeStrings: true, encoding: 'utf-8', objectMode: true })
    debug('new CliTransformer created');
  }
  stack = ''
  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    try {
      chunk = chunk.toString()
      let str = this.stack + chunk
      debug('str=', str)
      // if (str.trim().length) {
      //   if (str.endsWith('\n\n')) {
      //     this.stack = ''
      //     if (this.stdin)
      //       this.push('\nrestart> ')
      //   }
      //   else {
          let obj
          try {

            // let func = Function('"use strict"; return ' + str + ';');
            // obj = func()
            // debug('obj=', obj)
            // debug('generator=', generator)

            obj = JSON.parse(str);

            const returnObj = generator.fromJson(obj) || `<nothing returned: obj=${inspect(obj)}>`;
            debug('returnObj=', returnObj)
            this.push(returnObj + '\n')
            this.stack = ''
            if (this.stdin)
              this.push('start> ')
            callback()
          }
          catch (e: any) {
            console.error(e)
            if (e.name === 'SyntaxError') {
              console.error("Could not parse " + str)
            }
            this.stack += chunk.toString()
            if (this.stdin)
              this.push('\n' + str + '\ncont> ')
              callback(e)
          }
      //   }
      // }
      // else {
        // callback()
      // }
    }
    catch (e: any) {
        callback(e)
    }
  
  }
}


import debugFunc from 'debug'
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {inspect} from "util";
import {TypeHandlerFactory} from './type-handler-factory.js'

const debug = debugFunc('generator: index.ts')

export class Generator {

  compile(code: string, variables: [], arrayName = 'returnArray') {

    // extraCode + ';\nreturnArray.push(' + (obj.assignment_val ?? obj.val) +');'

    let functionString
    // if (variables === undefined || variables === {}) {
    //   functionString = 'return ' + code
    // } else {
    functionString = 'let ' + arrayName + ' = []; ' + arrayName + '.push(' + code + '); return ' + arrayName + '.join("")'
    // }

    const func = new Function(...Object.keys(variables ?? {}), functionString)
    return func
  }

  public async fromJson(json: FooDogNode[] | FooDogNode): Promise<any> {
    debug('Entering fromObject with json=', inspect(json, false, 30, true));

    if (Array.isArray(json)) {
      const outputArray: string[] = []
      for (const node of json) {
        let typeHandler = TypeHandlerFactory.createHandler(node, '');
        outputArray.push(await typeHandler.visit(node, `["${node.name}"]`, this.fromJson.bind(this)))
      }
      return outputArray.join("")
    } else {
      const node = json;
      debug('fromJson(): node=' + inspect(node, false, 30, true))
      let typeHandler = TypeHandlerFactory.createHandler(node, '');
      return typeHandler.visit(node, '', this.fromJson.bind(this))
    }
  }
}

import {TypeHandler} from "./@foo-dog/type-handler.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {inspect} from "util";import debugFunc from 'debug'

const debug = debugFunc('generator: generic-type-handler.ts')

export class GenericTypeHandler implements TypeHandler {
  handle(node: FooDogNode): string {
    return `TODO: implement node type '${node.type}'`
    // throw new Error(`No code to handle node: ${inspect(node)}`)
  }

  visit(node: FooDogNode | null, xpath: string = '/'): string {
    if (!node) return '';

    // Handle the current node and collect the result
    let result = this.handle(node);
    debug("result=" + inspect(result, false, 1, true));

    // // Recursively visit each child and collect their results
    // let length = !node.children ? 0 : node.children.length;
    // for (let i = 0; i < length; i++) {
    //   const childXPath = `${xpath}/children[${i + 1}]`;
    //   result += this.visit(node.children![i], childXPath);
    // }

    return result;
  }
}
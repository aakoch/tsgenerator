import {TypeHandler} from "./@foo-dog/type-handler.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import debugFunc from 'debug'

const debug = debugFunc('generator: generic-type-handler.ts')

export abstract class GenericTypeHandler implements TypeHandler {

  constructor(protected node: FooDogNode) {
  }

  visit(node: FooDogNode | null, xpath: string = '/'): string {
    throw new Error("visit not implemented");
  }

  abstract handle(node: FooDogNode | FooDogNode[], test: string, contentCallback?: Function): Function
}

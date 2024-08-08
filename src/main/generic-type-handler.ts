import {FooDogNode, TypeHandler } from '@foo-dog/types';
import debugFunc from 'debug'

const debug = debugFunc('generator: generic-type-handler.ts')

export abstract class GenericTypeHandler implements TypeHandler {

  constructor(protected node: FooDogNode) {
  }

  async visit(node: FooDogNode | null, xpath: string = '/'): Promise<string> {
    throw new Error("visit not implemented");
  }

  abstract handle(node: FooDogNode | FooDogNode[], test: string, contentCallback?: Function): Function
}

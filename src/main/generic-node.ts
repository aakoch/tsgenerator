import {AbstractNode} from "./abstract-node.js";
import {TypeHandler} from "./@foo-dog/type-handler.js";
import {GenericTypeHandler} from "./generic-type-handler.js";
import debugFunc from 'debug'
const debug = debugFunc('generator: generic-node.ts')

export class GenericNode extends AbstractNode {
  getHandler(): TypeHandler {
    throw new Error("inside GenericNode.getHandler")
    return new GenericTypeHandler();
  }
}
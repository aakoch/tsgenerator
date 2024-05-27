import {FooDogNode} from "./foo-dog-node.js";

export interface TypeHandler {
  visit(node: FooDogNode, xpath: string = '/', contentCallback?: Function): Promise<string>

  handle(node: FooDogNode, xpath: string, contentCallback?: Function): Function;
}
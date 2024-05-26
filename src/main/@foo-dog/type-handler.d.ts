import {FooDogNode} from "./foo-dog-node.js";

export interface TypeHandler {
  visit(node: FooDogNode, xpath: string = '/'): string

  handle(node: FooDogNode, test: string): Function;
}
import {TypeHandler} from "./@foo-dog/type-handler.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import { TagHandler } from "./tag-handler.js";

export class GenericTypeHandler {
  handle(node: FooDogNode): string {
    return `No code to handle node with val: ${node.val}, source: ${node.source}, lineNumber: ${node.lineNumber}, depth: ${node.depth}`;
  }

  visit(node: FooDogNode | null, xpath: string = '/'): string {
    if (!node) return '';

    // Create an appropriate handler for the current node
    let handler: TypeHandler = node.getHandler();
    
    // Handle the current node and collect the result
    let result = handler.handle(node);

    // Recursively visit each child and collect their results
    let length2 = !node.children ? 0 : node.children.length;
    for (let i = 0; i < length2; i++) {
      const childXPath = `${xpath}/children[${i + 1}]`;
      result += handler.visit(node.children![i], childXPath);
    }

    return result;
  }
}
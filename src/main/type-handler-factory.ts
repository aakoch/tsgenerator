import { FooDogNode } from "./@foo-dog/foo-dog-node.js";
import { TypeHandler } from "./@foo-dog/type-handler.js";
import {GenericTypeHandler} from "./generic-type-handler.js";
import { TagHandler } from "./tag-handler.js";

export class TypeHandlerFactory {

  static createHandler(node: FooDogNode, xpath: string): TypeHandler {
    let handler: TypeHandler;
    if (node.type === 'tag') {
      if (!node.val && (!node.children || node.children.length === 0)) {
        throw new Error(`Tag node must have either 'val' or 'children' attribute. Node: ${JSON.stringify(node)}, XPath: ${xpath}`);
      }
      handler = new TagHandler();
    } else if (node.type === 'text') {
      handler =
          new (class extends GenericTypeHandler {

            handle(node: FooDogNode): string {
              return node.val!;
            }
          })();
    } else {
      handler = new GenericTypeHandler();
    }
    return handler
  }
  
}

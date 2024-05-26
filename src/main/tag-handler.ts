import debugFunc from "debug";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {compile_new} from "./run.js";
import {TypeHandler} from "./@foo-dog/type-handler.js";

const debug = debugFunc("tsgenerator: tag-handler")

export class TagHandler implements TypeHandler {
  protected node: FooDogNode;

  constructor(node: FooDogNode) {
    this.node = node;
  }

  collectedValues: string[] = [];

  handle(node: FooDogNode, xpath?: string, contentCallback?: Function): Function {
    let f;
    debug("node.val=", node.val)
    if (node.assignment) {
      if (node.val !== undefined) {
        f = compile_new("['<', '" + node.name + "', '>', val, " + node.val + ", '</', '" + node.name + "', '>'].join('')", ['val', node.val])
      } else {
        f = compile_new("['<', '" + node.name + "', '>', val, '</', '" + node.name + "', '>'].join('')", ['val'])
      }
    } else {
      if (node.val !== undefined) {
        f = compile_new("['<', '" + node.name + "', '>', val, '" + node.val + "', '</', '" + node.name + "', '>'].join('')", ['val'])
      } else {
        f = compile_new("['<', '" + node.name + "', '>', val, '</', '" + node.name + "', '>'].join('')", ['val'])
      }
    }

    if (node.val !== undefined) {
    }
    debug("f=" + f.toString())
    return f;
  }

  shouldVisitChildren(): boolean {
    return this.node.name !== 'pre';
  }

  visit(node: FooDogNode, xpath?: string, contentCallback?: Function): string {

    let contents;
    if (node.children !== undefined) {
      contents = contentCallback!(node.children, xpath);
    }

    return this.handle(node, xpath, contentCallback)(contents);
  }
}

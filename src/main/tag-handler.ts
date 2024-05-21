import {inspect} from "util";
import debugFunc from "debug";
import {GenericTypeHandler} from "./generic-type-handler.js";
import {TagNode} from "./tag-node.js";

const debug = debugFunc("tsgenerator: tag-handler")

// export class TagHandler extends GenericTypeHandler {
//   handleChildren = function(children: FooDogNode[] | undefined, walk: Function) {
//     let arr = [];
//     if (Array.isArray(children)) {
//       for (const child of children!) {
//         debug('child=', inspect(child, false, 3));
//         arr.push(walk(child as unknown as FooDogNode))
//       }
//     }
//     return arr.join("");
//   }
//
//   handle(node: FooDogNode, walk: Function): string {
//     let content = this.handleChildren(node.children, walk) || node.val
//     return `<${node.name}>${content}</${node.name}>`;
//   }
// }

export class TagHandler extends GenericTypeHandler {
  collectedValues: string[];

  constructor() {
    super();
    this.collectedValues = [];
  }

  handle(node: TagNode): string {
    if (!node.val && (!node.children || node.children.length === 0) && (!node.attrs || node.attrs.length === 0)) {
      throw new Error(`Tag node must have either 'val', 'children' or 'attrs'. Node: ${inspect(node)}`);
    }
    debug("node=" + inspect(node, false, 2, true));
    
    // Collect the HTML representation
    let innerHTML: string | undefined;
    if (node.children && node.children.length > 0) {
      debug('node.children=' + node.children)
      debug('node.children.length=' + node.children.length)
      let arr = [];
      for (let i = 0; i < node.children.length; i++) {
        arr.push(this.visit(node.children[i], ''))
      }
      innerHTML = arr.join('');
      // innerHTML = node.children!.map(child => this.nodeToHTML(child,)).join('');
    } else {
      innerHTML = node.val;
    }
    
    
    const tagString = `<${node.name}>${innerHTML}</${node.name}>`;
    return tagString;
  }

  // nodeToHTML(node: FooDogNode): string | undefined {
  //   return this.visit(node, '')
  // }
}

import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {inspect} from "util";
import debugFunc from "debug";
import {GenericTypeHandler} from "./generic-type-handler.js";

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

  handle(node: FooDogNode): string {
    if (node.type === 'tag') {
      if (!node.val && (!node.children || node.children.length === 0)) {
        throw new Error(`Tag node must have either 'val' or 'children' attribute. Node: ${JSON.stringify(node)}`);
      }
      // Collect the HTML representation
      const innerHTML = node.children!.length > 0 ? node.children!.map(child => this.nodeToHTML(child)).join('') : node.val;
      const tagString = `<${node.name}>${innerHTML}</${node.name}>`;
      this.collectedValues.push(tagString);
      return tagString;
    } else {
      // Delegate to the parent class for non-tag nodes
      return super.handle(node);
    }
  }

  nodeToHTML(node: FooDogNode): string {
    if (node.type === 'tag') {
      const innerHTML = node.children!.length > 0 ? node.children!.map(child => this.nodeToHTML(child)).join('') : node.val;
      return `<${node.name}>${innerHTML}</${node.name}>`;
    } else {
      return node.val || "";
    }
  }

  getCollectedValues(): string[] {
    return this.collectedValues;
  }
}

import {inspect} from "util";
import debugFunc from "debug";
import {GenericTypeHandler} from "./generic-type-handler.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {compile, evil} from "./run.js";

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
  collectedValues: string[] = [];

  handleStart(): string {
    if (!this.node.val && (!this.node.children || this.node.children.length === 0) && (!this.node.attrs || this.node.attrs.length === 0)) {
      throw new Error(`Tag node must have either 'val', 'children' or 'attrs'. Node: ${inspect(this.node, false, 30, true)}`);
    }
    debug("node=" + inspect(this.node, false, 2, true));
    let variables = this.node;
    debug('handleStart(): this.node=', inspect(this.node, false, 30, true))
    let func = compile("arr.push('<');arr.push(name);arr.push('>');", ['name'], 'arr')
    debug('handleStart(): func=', func.toString())
    let result = func(this.node.name);
    debug('handleStart(): result=', result)
    return result;
  }

  handleEnd(): string {
    let variables = this.node;
    let func = compile("arr.push(val);arr.push('</');arr.push(name);arr.push('>');", ['val', 'name'], 'arr')
    let result = func(this.node.val ?? '', this.node.name);
    return result;
  }

  // nodeToHTML(node: FooDogNode): string | undefined {
  //   return this.visit(node, '')
  // }

  handle(node: FooDogNode, xpath: string): Function {
    let contents;
    let f;
    debug("node.val=", node.val)
    if (node.assignment) { //} || (node.val?.startsWith("\"") && node.val?.endsWith("\""))) {
      f = compile(`returnArray.push("<${node.name}>" + ${node.val} + "</${node.name}>");`, [node.val!]);
    } else {
      f = compile(`returnArray.push("<${node.name}>${node.val}</${node.name}>");`);
    }
    debug("f=" + f.toString())
    return f;
  }

  shouldVisitChildren(): boolean {
    return this.node.name !== 'pre';
  }
}

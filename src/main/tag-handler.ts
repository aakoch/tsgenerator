import {inspect} from "util";
import debugFunc from "debug";
import {GenericTypeHandler} from "./generic-type-handler.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {compile, compile_new} from "./run.js";

const debug = debugFunc("tsgenerator: tag-handler")

export class TagHandler extends GenericTypeHandler {
  collectedValues: string[] = [];

  handleStart(): string {
    if (!this.node.val && (!this.node.children || this.node.children.length === 0) && (!this.node.attrs || this.node.attrs.length === 0)) {
      throw new Error(`Tag node must have either 'val', 'children' or 'attrs'. Node: ${inspect(this.node, false, 30, true)}`);
    }

    let func = compile_new("['<', name, '>'].join('')", ['name'])
    let result = func(this.node.name);
    return result;
  }

  handleEnd(): string {
    let func = compile_new("[val, '</', name, '>'].join('')", ['val', 'name'])
    let result = func(this.node.val ?? '', this.node.name);
    return result;
  }

  handle(node: FooDogNode, xpath: string): Function {
    let contents;
    let f;
    debug("node.val=", node.val)
    if (node.assignment) { //} || (node.val?.startsWith("\"") && node.val?.endsWith("\""))) {
      f = compile(`returnArray.push("<${node.name}>" + ${node.val} + "</${node.name}>");`, [node.val!]);
    } else {
      // contents = evil(node.val);
      f = compile(`returnArray.push("<${node.name}>${node.val}</${node.name}>");`);
    }
    debug("f=" + f.toString())
    return f;
  }

  shouldVisitChildren(): boolean {
    return this.node.name !== 'pre';
  }
}

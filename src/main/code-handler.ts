import debugFunc from "debug";
import {Attribute, FooDogNode, TypeHandler} from "@foo-dog/types";
import {compile_new} from "./run.js";

const debug = debugFunc("tsgenerator: code-handler")

function isAttribute(val: string | Attribute[] | undefined): val is Attribute[] {
  return Array.isArray(<Attribute[]>val);
}

export class CodeHandler implements TypeHandler {
  protected node: FooDogNode;

  constructor(node: FooDogNode) {
    this.node = node;
  }

  collectedValues: string[] = [];

  handle(node: FooDogNode, xpath?: string, contentCallback?: Function): Function {
    return compile_new('');
  }

  async visit(node: FooDogNode, xpath?: string, contentCallback?: Function): Promise<string> {

    let contents;
    if (node.children !== undefined) {
      contents = await contentCallback!(node.children, xpath);
    }

    // if (contents.constructor.name === 'Promise') {
    //   let p: Promise<any> = contents as Promise<any>;
    //   return this.handle(node, xpath, contentCallback)(contents);
    // } else {
      return this.handle(node, xpath, contentCallback)(contents);
    // }
  }
}

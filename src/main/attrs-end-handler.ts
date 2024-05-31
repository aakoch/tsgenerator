import debugFunc from "debug";
import {Attribute, FooDogNode, FooDogNodeType} from "./@foo-dog/foo-dog-node.js";
import {compile_new} from "./run.js";
import {TypeHandler} from "./@foo-dog/type-handler.js";

const debug = debugFunc("tsgenerator: attrs-end-handler")

function isAttribute(val: string | Attribute[] | undefined): val is Attribute[] {
  return Array.isArray(<Attribute[]>val);
}


export class AttrsEndHandler implements TypeHandler {
  protected node: FooDogNode;

  constructor(node: FooDogNode) {
    this.node = node;
  }

  collectedValues: string[] = [];

  handle(node: FooDogNode, xpath?: string, contentCallback?: Function): Function {    
    let attrs = '';

    // if (isAttribute(node.val)) {
    //   for (const attr of node.val!) {
    //     attrs += ' ' + attr.name + '="' + attr.name + '"';
    //   }
    // }
    return () => attrs
  }

  async visit(node: FooDogNode, xpath?: string, contentCallback?: Function): Promise<string> {
    return this.handle(node, xpath || '')();
  }
}


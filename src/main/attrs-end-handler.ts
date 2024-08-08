import debugFunc from "debug";
import {Attribute, FooDogNode, TypeHandler} from "@foo-dog/types/dist/index.js";

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


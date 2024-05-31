import debugFunc from "debug";
import {Attribute, FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {compile_new} from "./run.js";
import {TypeHandler} from "./@foo-dog/type-handler.js";

const debug = debugFunc("tsgenerator: unbuf-code-handler")

function isAttribute(val: string | Attribute[] | undefined): val is Attribute[] {
  return Array.isArray(<Attribute[]>val);
}

export class UnbufCodeHandler implements TypeHandler {
  protected node: FooDogNode;

  constructor(node: FooDogNode) {
    this.node = node;
  }

  collectedValues: string[] = [];

  handle(node: FooDogNode, xpath?: string, contentCallback?: Function): Function {
    throw new Error('Not yet implemented');
    // let f;
    // debug("node.val=", node.val)
    // let attrs = '';
    // if (node.attrs !== undefined) {
    //   attrs += ' '
    //   for (const attr of node.attrs) {
    //     attrs += attr.name + '="' + attr.val + '"';
    //   }
    // }
    // if (node.attrs_start !== undefined) {
    //   for (const attr of node.attrs_start) {
    //     attrs += ' '  + attr.name + '="' + attr.name + '"';
    //   }
    //  
    //   let attrsEndChildren = node.children?.filter((child: FooDogNode) => {
    //     return child.type === 'attrs_end'
    //   })
    //  
    //   if (attrsEndChildren?.length! > 0) {
    //     for (const attrsEndChild of attrsEndChildren!) {
    //
    //       if (isAttribute(attrsEndChild.val)) {
    //         for (const attr of attrsEndChild.val!) {
    //           attrs += ' ' + attr.name + '="' + attr.name + '"';
    //         }
    //       }
    //     }
    //   }
    //  
    // }
    // if (node.assignment) {
    //   if (node.val !== undefined && !isAttribute(node.val)) {
    //     f = compile_new("return ['<', '" + node.name + "', '" + attrs + "', '>', val, " + node.val + ", '</', '" + node.name + "', '>'].join('')", ['val', node.val])
    //   } else {
    //     f = compile_new("return ['<', '" + node.name + "', '" + attrs + "', '>', val, '</', '" + node.name + "', '>'].join('')", ['val'])
    //   }
    // } else {
    //   if (node.val !== undefined) {
    //     f = compile_new("return ['<', '" + node.name + "', '" + attrs + "', '>', val, '" + node.val + "', '</', '" + node.name + "', '>'].join('')", ['val'])
    //   } else {
    //     f = compile_new("return ['<', '" + node.name + "', '" + attrs + "', '>', val, '</', '" + node.name + "', '>'].join('')", ['val'])
    //   }
    // }
    //
    // if (node.val !== undefined) {
    // }
    // debug("f=" + f.toString())
    // return f;
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

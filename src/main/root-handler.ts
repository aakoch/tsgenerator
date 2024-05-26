import {inspect} from "util";
import debugFunc from "debug";
import {GenericTypeHandler} from "./generic-type-handler.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {compile, evil, run} from "./run.js";
import { TypeHandler } from "./@foo-dog/type-handler.js";
import {TypeHandlerFactory} from "./type-handler-factory.js";

const debug = debugFunc("tsgenerator: root-handler")


export class RootTypeHandler extends GenericTypeHandler{
  
  handle(node: FooDogNode, xpath: string): Function {

    let strings = this.visitChildren2(node.children!, xpath);
    debug("handle: strings=", strings)
    return ((ss: string[]) => {
      debug("ss=", ss)
      return ss.join('')
    }).bind(this, strings);
  }

  // visit(node: FooDogNode | null, xpath?: string): string {
  //   return "RootTypeHandler";
  //
  // }

  private visitChildren2 (children: FooDogNode[], xpath: string) {
    let content: string[] = [];

    // Recursively visit each child and collect their results
    let length = !children ? 0 : children.length;
    for (let i = 0; i < length; i++) {
      const childXPath = `${xpath}/children[${i + 1}]`;
      let childTypeHandler = TypeHandlerFactory.createHandler(children![i], childXPath);
      debug("visitChildren2 [" + i + "]: childTypeHandler=", childTypeHandler.constructor.name)
      
      let f = childTypeHandler.handle(children![i], childXPath);
      debug("visitChildren2 [" + i + "]: f=", f.toString());
      let params = children![i].params;
      debug("visitChildren2 [" + i + "]: params=", params);
      
      
      let result = f(evil(params));
      
      debug("visitChildren2 [" + i + "]: result=", result);
      content.push(result);
    }
    return content;
  }

}
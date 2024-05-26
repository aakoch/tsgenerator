import {inspect} from "util";
import debugFunc from "debug";
import {GenericTypeHandler} from "./generic-type-handler.js";
import mixinService from "./mixin-service.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {compile} from "./run.js";

const debug = debugFunc("tsgenerator: mixin-call-handler")

export class MixinCallHandler extends GenericTypeHandler {
  collectedValues: string[] = [];

  handle(node: FooDogNode, xpath: string): Function {

    debug("node=" + inspect(node, false, 2, true));

    if (node && node.name) {

      let mixin = mixinService.findMixin(node.name);
      if (mixin !== undefined) {
        debug("visit: node.params=", node.params);
        return mixin
      } else {
        return () => {`[No mixin in mixin-call-handler named ${node.name}]`};
      }
    } else {
      debug('[Error in mixin-call-handler] node:' + inspect(node, false, 20, true));
      return () => {''}
    }
    
    // debug("handle: node=", node)
    // let s = this.visit(node, xpath);
    //
    // debug("handle: s=", s);
    //
    // // let attrs: string[] = [];
    // return compile("arr.push(s);", ['s'], 'arr');
  }

  visit(node: FooDogNode, xpath: string = '/'): string {
      const f = this.handle(node, xpath);
    return f(node.params)
  }
  
  handleStart(): string {
    return '';
  }

  handleEnd(): string {
    return '';
  }

  shouldVisitChildren(): boolean {
    return false;
  }
}

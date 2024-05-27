import {inspect} from "util";
import debugFunc from "debug";
import mixinService from "./mixin-service.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {TypeHandler} from "./@foo-dog/type-handler.js";

const debug = debugFunc("tsgenerator: mixin-call-handler")

export class MixinCallHandler implements TypeHandler {
  collectedValues: string[] = [];

  constructor(private node: FooDogNode) {
  }

  handle(node: FooDogNode, xpath: string): Function {

    debug("node=" + inspect(node, false, 2, true));

    if (node && node.name) {

      let mixin = mixinService.findMixin(node.name);
      if (mixin !== undefined) {
        debug("visit: node.params=", node.params);
        return mixin //(node.params ?? [])
        //.bind(this, node.val)
      } else {
        return () => {
          `[No mixin in mixin-call-handler named ${node.name}]`
        };
      }
    } else {
      debug('[Error in mixin-call-handler] node:' + inspect(node, false, 20, true));
      return () => {
        ''
      }
    }
  }

  async visit(node: FooDogNode, xpath: string = '/'): Promise<string> {
    const f = this.handle(node, xpath);
    return f(node.params)
  }
}

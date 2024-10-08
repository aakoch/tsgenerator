import debugFunc from "debug";
import mixinService from "./mixin-service.js";
import {TypeHandlerFactory} from "./type-handler-factory.js";
import {FooDogNode, TypeHandler } from "@foo-dog/types";

const debug = debugFunc("tsgenerator: mixin-handler")

const EMPTY_FUNCTION = () => {
  return ""
};

export class MixinHandler implements TypeHandler {
  collectedValues: string[] = [];
  private name?: string;

  constructor(private node: FooDogNode) {
  }

  handle(node: FooDogNode, xpath: string): Function {

    let regex = /(?<name>\w+)(?:\((?<attrs>.*)\))?/g;
    if (node.val === null || node.val === undefined) {
      throw new Error("Node 'val' was null or undefined");
    }

    const [[, name, attrs]] = [...(node.val as string)!.matchAll(regex)];
    debug("name=", name, ", attrs=", attrs)

    // TODO: expand this to more than just 1 child
    let typeHandler = TypeHandlerFactory.createHandler(node.children![0], xpath + "/children[?]");

    debug("handle: children[0] typeHandler=", typeHandler.constructor.name)

    let func = typeHandler.handle(node.children![0], xpath + "/children[0]");
    mixinService.registerMixin(name, func);
    return EMPTY_FUNCTION;
  }

  async visit(node: FooDogNode, xpath?: string, contentCallback?: Function): Promise<string> {
    return this.handle(node, xpath || '')();
  }

}

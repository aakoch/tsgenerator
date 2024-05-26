import {inspect} from "util";
import debugFunc from "debug";
import {GenericTypeHandler} from "./generic-type-handler.js";
import {FooDogNode, Mixin} from "./@foo-dog/foo-dog-node.js";
import mixinService from "./mixin-service.js";
// import {GenericMixin} from "./generic-mixin.js";
import {compile} from "./run.js";
import {TypeHandlerFactory} from "./type-handler-factory.js";

const debug = debugFunc("tsgenerator: mixin-handler")

const EMPTY_FUNCTION = () => {
  return ""
};

export class MixinHandler extends GenericTypeHandler {
  collectedValues: string[] = [];
  private name?: string;

  constructor(node: FooDogNode) {
    super(node);

  }

  handle(node: FooDogNode, xpath: string): Function {
    // let s = this.visit(node, xpath);
    //
    // debug("handle: s=", s);
    //
    // let attrs: string[] = [];
    // return compile("arr.push('" + s + "');", attrs, 'arr');



    let regex = /(?<name>\w+)(?:\((?<attrs>.*)\))?/g;
    if (node.val === null || node.val === undefined) {
      throw new Error("Node 'val' was null or undefined");
    }

    // debug("node.val=", node.val);
    const [[, name, attrs]] = [...node.val!.matchAll(regex)];
    debug("name=", name, ", attrs=", attrs)

    // let mixin = new GenericMixin();
    // mixin.name = name;
    // mixin.attrs = attrs.split(',');

    // let funcs: Function[] = []
    // for (const child of node.children!) {
    //   let typeHandler = TypeHandlerFactory.createHandler(child, xpath + "/children[?]");
    //   funcs.push(typeHandler.handle(child, xpath + "/children[?]"));
    // }
    //
    // let func = () => funcs.map(f => {
    //   return f();
    // }).join("")
    // TODO: expand this to more than just 1 child
    let typeHandler = TypeHandlerFactory.createHandler(node.children![0], xpath + "/children[?]");

    debug("handle: children[0] typeHandler=", typeHandler.constructor.name)
    
    let func = typeHandler.handle(node.children![0], xpath + "/children[0]");
    mixinService.registerMixin(name, func);
    return EMPTY_FUNCTION;
  }

  handleStart(): string {
    // debug("node=" + inspect(this.node, false, 2, true));
    //
    // let mixin: Mixin = new GenericMixin();
    // let name = this.node.name;
    // mixin.name = name;
    // if (name) {
    //   mixinService.registerMixin(name, mixin);
    // }

    return '';
  }

  handleEnd(): string {

    return '';
  }

  // shouldVisitChildren(): boolean {
  //   return false;
  // }
}

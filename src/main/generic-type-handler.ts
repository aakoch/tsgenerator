import {TypeHandler} from "./@foo-dog/type-handler.js";
import {FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {inspect} from "util";
import debugFunc from 'debug'
import {TypeHandlerFactory} from "./type-handler-factory.js";
import {compile} from "./run.js";
import {end} from "tap";

const debug = debugFunc('generator: generic-type-handler.ts')

export abstract class GenericTypeHandler implements TypeHandler {
  protected node: FooDogNode;
  constructor(node: FooDogNode) {
    this.node = node;
  }
  
  handleStart(): string {
    // return `TODO: implement function handlerStart for node type '${node.type}'`
    // debugger;
    throw new Error(`No code to handle node type ${this.node.type}: ${inspect(this.node, false, 10)}`)
  }
  handleEnd(): string {
    // return `TODO: implement function handleEnd for node type '${node.type}'`
    throw new Error(`No code to handle node: ${inspect(this.node)}`)
  }

  shouldVisitChildren(){
    return true;
  }

  visit(node: FooDogNode | null, xpath: string = '/'): string {
    if (!node) return '';

    // Handle the current node and collect the result
    let start = this.handleStart();
    debug("start=" + inspect(start, false, 1, true));

    let content = this.shouldVisitChildren() ? this.visitChildren(node, xpath) : [];

    let end = this.handleEnd();
    debug("end=" + inspect(end, false, 1, true));

    return start + content.join('') + end;
  }

  private visitChildren (node: FooDogNode, xpath: string) {
    let content: string[] = [];

    // Recursively visit each child and collect their results
    let length = !node.children ? 0 : node.children.length;
    for (let i = 0; i < length; i++) {
      const childXPath = `${xpath}/children[${i + 1}]`;
      let childTypeHandler = TypeHandlerFactory.createHandler(node.children![i], childXPath);
      content.push(childTypeHandler.visit(node.children![i], childXPath));
    }
    return content;
  }

  abstract handle(node: FooDogNode | FooDogNode[], test: string): Function
}

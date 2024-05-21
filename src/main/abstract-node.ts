import {Attribute, FooDogNode, FooDogNodeType} from "./@foo-dog/foo-dog-node.js";
import {TypeHandler} from "./@foo-dog/type-handler.js";
import {GenericTypeHandler} from "./generic-type-handler.js";

export abstract class AbstractNode implements FooDogNode {

  val?: string;
  name?: string;
  source?: string;
  lineNumber?: number;
  depth?: number;
  children: FooDogNode[] = [];
  attrs?: Attribute[];
  type: FooDogNodeType;

  constructor(type: FooDogNodeType) {
    this.type = type;
    // this.val = val;
    // this.name = name;
    // this.source = source;
    // this.lineNumber = lineNumber;
    // this.depth = depth;
    // this.children = [];
  }

  addChild(child: FooDogNode) {
    this.children.push(child);
  }

  abstract getHandler(): TypeHandler
}
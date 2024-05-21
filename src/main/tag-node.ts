import {GenericNode} from "./generic-node.js";
import {TypeHandler} from "./@foo-dog/type-handler.js";
import {TagHandler} from "./tag-handler.js";

export class TagNode extends GenericNode {
  constructor() {
    super("tag");
  }

  getHandler(): TypeHandler {
    return new TagHandler();
  }
}
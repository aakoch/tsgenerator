import {TagHandler} from "./tag-handler.js";
import {MixinHandler} from "./mixin-handler.js";
import {MixinCallHandler} from "./mixin-call-handler.js";
import {RootTypeHandler} from "./root-handler.js";
import {AttrsEndHandler} from "./attrs-end-handler.js";
import {CodeHandler} from "./code-handler.js";
import { FooDogNode, TypeHandler } from "@foo-dog/types";
import {CaseHandler} from "./case-handler.js";
import {ConditionHandler} from "./condition-handler.js";

export class TypeHandlerFactory {

  static createHandler(node: FooDogNode, xpath: string): TypeHandler {
    let handler: TypeHandler;
    const type = node.type;
    if (type === 'tag') {
      handler = new TagHandler(node);
    } else if (type === 'text') {
      handler =
          new class implements TypeHandler {
            async visit(node: FooDogNode, xpath?: string, contentCallback?: Function): Promise<string> {
              return this.handle(node, xpath || '')();
            }

            handle(node: FooDogNode | FooDogNode[], xpath: string): Function {
              throw new Error("\"handle\" method not implemented for type \"" + (node as FooDogNode).type + "\"");
            }
          }();
    } else if (type === 'html_comment') {
      handler =
          new class implements TypeHandler {
            async visit(node: FooDogNode, xpath?: string, contentCallback?: Function): Promise<string> {
              return this.handle(node, xpath || '')();
            }

            handle(node: FooDogNode | FooDogNode[], xpath: string): Function {
              throw new Error("\"handle\" method not implemented for type \"" + (node as FooDogNode).type + "\"");
            }
          }();
    } else if (type === 'comment') {
      handler =
          new class implements TypeHandler {
            async visit(node: FooDogNode, xpath?: string, contentCallback?: Function): Promise<string> {
              return this.handle(node, xpath || '')();
            }

            handle(node: FooDogNode | FooDogNode[], test: string): Function {
              throw new Error("\"handle\" method not implemented for type \"" + (node as FooDogNode).type + "\"");
            }
          }();
    } else if (type === 'attrs_end') {
      handler = new AttrsEndHandler(node)
    } else if (type === 'mixin') {
      handler = new MixinHandler(node);
    } else if (type === 'mixin_call') {
      handler = new MixinCallHandler(node);
    } else if (type === 'rootType') {
      handler = new RootTypeHandler(node);
    } else if (type === 'unbuf_code') {
      handler = new CodeHandler(node);
    } else if (type === 'case') {
      handler = new CaseHandler(node);
    } else if (type === 'when') {
      handler = new ConditionHandler(node);
    } else if (type === 'default') {
      handler = new CaseHandler(node);
    } else {
      throw new Error("No handler for node type \"" + node.type + "\"");
    }

    return handler
  }

}

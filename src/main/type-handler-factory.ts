import {Attribute, FooDogNode} from "./@foo-dog/foo-dog-node.js";
import {TypeHandler} from "./@foo-dog/type-handler.js";
import {GenericTypeHandler} from "./generic-type-handler.js";
import {TagHandler} from "./tag-handler.js";
import {MixinHandler} from "./mixin-handler.js";
import {MixinCallHandler} from "./mixin-call-handler.js";
import {RootTypeHandler} from "./root-handler.js";

// class ArrayHandler implements TypeHandler {
//   handle(node: FooDogNode): string {
//     return "";
//   }
//
//   visit(node: FooDogNode | null, xpath?: string): string {
//     return "";
//   }
// }

export class TypeHandlerFactory {

  static createHandler(node: FooDogNode, xpath: string): TypeHandler {
    // if (Array.isArray(node)) {
    //   return new ArrayHandler();
    // }
    
    let handler: TypeHandler;
    const type = node.type;
    if (type === 'tag') {
      handler = new TagHandler(node);
    } else if (type === 'text') {
      handler =
          new class extends GenericTypeHandler {
            handle(node: FooDogNode | FooDogNode[], test: string): Function {
              throw new Error("\"handle\" method not implemented for type \"" + (node as FooDogNode).type + "\"");
            }
            
            handleStart(): string {
              return node.val!;
            }

            handleEnd(): string {
              return '';
            }
          }(node);
    } else if (type === 'html_comment') {
      handler =
          new (class extends GenericTypeHandler {
            handle(node: FooDogNode | FooDogNode[], test: string): Function {
              throw new Error("\"handle\" method not implemented for type \"" + (node as FooDogNode).type + "\"");
            }

            handleStart(): string {
              return "<!---";
            }

            handleEnd(): string {
              return node.val + " -->";
            }
          })(node);
    } else if (type === 'comment') {
      handler =
          new (class extends GenericTypeHandler {
            handle(node: FooDogNode | FooDogNode[], test: string): Function {
              throw new Error("\"handle\" method not implemented for type \"" + (node as FooDogNode).type + "\"");
            }
            
            handleStart(): string {
              return "";
            }

            handleEnd(): string {
              return "";
            }
          })(node);
    } else if (type === 'attrs_end') {
      handler =
          new (class extends GenericTypeHandler {
            handle(node: FooDogNode | FooDogNode[], test: string): Function {
              throw new Error("\"handle\" method not implemented for type \"" + (node as FooDogNode).type + "\"");
            }

            handleStart(): string {
              return "";
            }

            handleEnd(): string {
              let results: string[] = [];
              for (let attr in node.attrs!) {
                results.push(`${(attr as unknown as Attribute).key}=${(attr as unknown as Attribute).value}`)
              }
              return results.join('') + ">"
            }
          })(node);
    } else if (type === 'mixin') {
      handler = new MixinHandler(node);
    } else if (type === 'mixin_call') {
      handler = new MixinCallHandler(node);
    } else if (type === 'rootType') {
      handler = new RootTypeHandler(node);
    } else {
      throw new Error("No handler for node type \"" + node.type + "\"");
    }
    
    return handler
  }

}

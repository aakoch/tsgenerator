import debugFunc from 'debug'
import {HTMLDivElement, HTMLElement,} from './dom-interfaces.js';
import {Attribute, FooDogNode, FooDogNodeType} from "./@foo-dog/foo-dog-node.js";
import {inspect} from "util";
import assert from "node:assert";
import {TypeHandler} from "./@foo-dog/type-handler.js";
import {TagHandler} from "./tag-handler.js";
import {GenericTypeHandler} from "./generic-type-handler.js";
import {not} from "tap";
import {TagNode} from "./tag-node.js";
import {GenericNode} from "./generic-node.js";
import {TypeHandlerFactory} from './type-handler-factory.js'
// import { JSDOM } from 'jsdom'

const debug = debugFunc('generator: index.ts')

// class HTMLElement2 extends HTMLElement {
//   constructor(private name: string) {
//     super()
//   }
//
//   innerHTML: any;
//   // outerHTML: string | undefined;
// }

// class HTMLDivElement extends HTMLElement {
//   constructor() {
//     super('div')
//   }
// }

// // Create a new JSDOM instance
// const dom = new JSDOM(`
//   <!DOCTYPE html>
//   <html>
//     <body>
//       <div id="myElement">Hello, world!</div>
//     </body>
//   </html>
// `);
//
//
// const window = dom.window;
// const document = window.document;


// class NodeFactory {
//   static createNode(node: any): HTMLElement {
//
//     // console.log(node)
//
//     let el: HTMLDivElement;
//    
//     el = {children: node.children, name: node.name, val: node.val, innerHTML: "", outerHTML: ""};
//    
//     return el;
//   }
// }

//

// Document, Element, and DocumentFragment

// interface FooDogNode extends Node {
//   val?: any;
//   type: string;
//   name?: string;
//   children?: FooDogNode[];
//   generate(): string;
//   wraps(): boolean;
// }
//
// abstract class TagNode implements FooDogNode {
//   constructor(private node: FooDogNode) {
//     this.name = node.name!
//
//     if (node.children) {
//     }
//   }
//
//   name: string;
//   type: string = 'tag';
//
//   generate(): string {
//
//     let contents: string = this.node.val
//
//     if (this.node.children) {
//       debug('this.node.children=' + this.node.children);
//       this.node.children.forEach((child: FooDogNode) => {
//         debug('child.generate=' + child.generate);
//         contents += child.generate()
//       });
//     }
//
//     const attributes = ''
//     return `<${this.node.name}${attributes}>${contents}</${this.node.name}>`
//   }
//
//   abstract wraps(): boolean;
// }
//
// class WrappingTagNode extends TagNode {
//   wraps(): boolean {
//     return true;
//   }
//
// }

export function run() {
  // let node: FooDogNode = {
  //   wraps(): boolean {
  //     return false;
  //   }, generate: () => "Hello world!", type: "run"};
  //
  // console.log(node.generate())
  //
  // let tagNode = categorize(node)
  // console.log(tagNode.generate())
}

function getTypeHandler(type: FooDogNodeType): TypeHandler {
  debug("getTypeHandler(): type=" + type)
  if (type === 'tag') {
    return new TagHandler()
  }
  else {
    return new GenericTypeHandler()
  }
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
  obj[key] = value;
  
}

function setPropertyWithSetter<T>(obj: T, key: keyof T, value: any) {
  Object.defineProperty(obj, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}

class FooDogNodeFactory {
  
  static createNode(type: FooDogNodeType, futureNode: any): FooDogNode {
    debug('createNode(): futureNode=' + inspect(futureNode, false, 30, true))
    let node: FooDogNode;
    if (type === "tag") {
      node = new TagNode();
    }
    else if (type === "text") {
      node = new (class extends GenericNode {
        constructor() {
          super('text')
        }

        getHandler(): TypeHandler {
          // TODO: this is duplicated in another place
          return new (class extends GenericTypeHandler {
            handle(node: FooDogNode): string {
              return node.val!;
            }
          })();
        }
      })();
    }
    else {
      node = new GenericNode(type);
    }

    for (const key of Object.keys(futureNode)) {
      debug(`createNode(): {key: ${key}, value: ${futureNode[key]}`);
      if (futureNode[key]) {
        setPropertyWithSetter(node, key as keyof FooDogNode, futureNode[key]);
      }
    }
    
    // for (const key in node) {
    //   // setProperty<FooDogNode, FooDogNodeType>(node, key, futureNode[key]);
    //   debug(`createNode(): {key: ${key}, value: ${futureNode[key]}`);
    //   setPropertyWithSetter(node, key as keyof FooDogNode, futureNode[key]);
    // }
    return node;
  }
}

// function doFromObject(obj: FooDogNode, walk: Function) {
//   debug('Entering doFromObject with obj=', obj);
//   debug('Entering doFromObject with walk=', walk);
//   let typeHandler = getTypeHandler(obj.type);
//   debug('typeHandler=', typeHandler);
//   return typeHandler.call(obj, walk)
// }


function doFromObject(node: FooDogNode | null, xpath: string = '/'): string {
  if (!node) return '';

  // Create an appropriate handler for the current node
  let handler: TypeHandler;
  if (node.type === 'tag') {
    if (!node.val && node.children && node.children.length === 0) {
      throw new Error(`Tag node must have either 'val' or 'children' attribute. Node: ${JSON.stringify(node)}, XPath: ${xpath}`);
    }
    handler = new TagHandler();
  } else {
    handler = new GenericTypeHandler();
  }

  // Handle the current node and collect the result
  let result = handler.handle(node);

  // Recursively visit each child and collect their results
  for (let i = 0; i < node.children!.length; i++) {
    const childXPath = `${xpath}/children[${i + 1}]`;
    result += handler.visit(node.children![i], childXPath);
  }

  return result;
}

export class Generator {

  compile(code: string, variables: [], arrayName = 'returnArray') {

    // extraCode + ';\nreturnArray.push(' + (obj.assignment_val ?? obj.val) +');'

    let functionString
    // if (variables === undefined || variables === {}) {
    //   functionString = 'return ' + code
    // } else {
    functionString = 'let ' + arrayName + ' = []; ' + arrayName + '.push(' + code + '); return ' + arrayName + '.join("")'
    // }

    const func = new Function(...Object.keys(variables ?? {}), functionString)
    return func
  }


// Function to convert a JSON object to a tree of FooDogNode
  objectToFooDogNode = function objectToFooDogNode(obj: any): FooDogNode {
    debug('objectToFooDogNode(): obj=' + inspect(obj, false, 30, true))
    const node = FooDogNodeFactory.createNode(obj.name, obj);
    if (obj.children) {
      for (let i = 0; i < obj.children.length; i++){
        // const childJson: any = obj.children[i];
        obj.children[i] = objectToFooDogNode(obj.children[i]);
      }
    }
    return node;
  }


  fromJson(json: [] | object): any {
    debug('Entering fromObject with json=', inspect(json, false, 30, true));
    
    if (Array.isArray(json)) {
      const nodes: FooDogNode[] = json.map((item) : FooDogNode => { return this.objectToFooDogNode(item) });
      debug('fromJson(): nodes=' + inspect(nodes, false, 30, true))
      const outputArray: string[] = []
      for (const node of nodes) {
        let typeHandler = getTypeHandler(node.type);
        outputArray.push(typeHandler.visit(node, ''))
      }
      return outputArray.join("")
    }
    else {
      const node = this.objectToFooDogNode(json)
      debug('fromJson(): node=' + inspect(node, false, 30, true))
      let typeHandler = getTypeHandler(node.type);
      return typeHandler.visit(node, '')
    }


    // let children = []
    // if (obj.hasOwnProperty("children")) {
    //   // children = obj.children
    // }
    //
    //
    // const node2 = NodeFactory.createNode(obj)

    // console.log("node2.val = ", node2.val);
    // let inner = `${node2.val ?? node2.children.map((c: any) => 
    //   NodeFactory.createNode(c).outerHTML
    // )}`
    // console.log('inner=' + inner)
    //
    // let outer = `<${node2.name}>${inner}</${node2.name}>`
    //
    // console.log('outer=' + outer)
    //
    // // node.innerHTML = obj['val'];`
    //
    // return outer
  }
}


async function jsonStringToObject(str: string): Promise<object> {
  return {}
}

// function categorize(node_: {
//   val: string;
//   name: string;
//   type: string}): HTMLElement_ {
//   if (node_.type === 'tag') {
// // Create a new HTMLElement (e.g., a div element)
// //     const newElement: HTMLElement = NodeFactory.createNode(node_);
//     const newElement: HTMLElement_ = {innerHTML: "", outerHTML: ""};
//     // newElement.innerText = node_.val;
//     return newElement;
//   }
//   else {
//     throw new Error("Unknown type " + node_.type)
//   }
//   // } else {
//   //   return {
//       // wraps(): boolean {
//       //   return false;
//       // }, generate: () => "Hello world!", type: "run"
//     // }
//   // }
// }
//
// interface CustomHTMLElement extends HTMLElement {
//   customMethod(): void;
// }
//
// class CustomHTMLElementImpl implements CustomHTMLElement {
//   id: string = '';
//   className: string = '';
//   textContent: string | null = null;
//
//   // Implementing other properties and methods from HTMLElement interface
//   // For simplicity, only a few are implemented here
//   style: CSSStyleDeclaration = {} as CSSStyleDeclaration;
//   // appendChild(newChild: Node): Node {
//   appendChild<T extends Node>(newChild: T): T {
//     throw new Error("Method not implemented.");
//   }
//   cloneNode(deep?: boolean): Node {
//     throw new Error("Method not implemented.");
//   }
//   compareDocumentPosition(other: Node): number {
//     throw new Error("Method not implemented.");
//   }
//   // Add all other necessary method implementations...
//
//   // Custom method
//   customMethod(): void {
//     console.log("This is a custom method");
//   }
// }
//
//
// // Usage example
// const myElement = new CustomHTMLElementImpl();
// myElement.id = 'myElement';
// myElement.className = 'my-class';
// myElement.textContent = 'Hello, custom DOM!';
// myElement.customMethod(); // Output: This is a custom method
//
// console.log(myElement);

// Define FooDogNodeType
type FooDogNodeType = 'tag' | 'rootType' | 'nonTagType';

// Define FooDogNode interface with accept method
interface FooDogNode {
  val: string;
  type: FooDogNodeType;
  name?: string;
  source: string;
  lineNumber: number;
  depth: number;
  children: FooDogNode[];
  addChild(child: FooDogNode): void;
  accept(visitor: TypeVisitor, xpath: string): void;
}

abstract class AbstractFooDogNode implements FooDogNode {
  val: string;
  type: FooDogNodeType;
  name?: string;
  source: string;
  lineNumber: number;
  depth: number;
  children: FooDogNode[];

  constructor(val: string, type: FooDogNodeType, source: string, lineNumber: number, depth: number, name?: string) {
    this.val = val;
    this.type = type;
    this.name = name;
    this.source = source;
    this.lineNumber = lineNumber;
    this.depth = depth;
    this.children = [];
  }

  addChild(child: FooDogNode) {
    this.children.push(child);
  }

  abstract accept(visitor: TypeVisitor, xpath: string): void;
}

class GenericFooDogNode extends AbstractFooDogNode {
  accept(visitor: TypeVisitor, xpath: string) {
    visitor.visitGenericNode(this, xpath);
  }
}

class TagFooDogNode extends GenericFooDogNode {

  constructor(val: string, source: string, lineNumber: number, depth: number, name?: string) {
    super(val, 'tag', source, lineNumber, depth, name);
  }

  addChild(child: FooDogNode) {
    this.children.push(child);
  }

  accept(visitor: TypeVisitor, xpath: string) {
    visitor.visitTagNode(this, xpath);
  }
}

// Factory class to create FooDogNodes
class FooDogNodeFactory {
  static createBasicNode(val: string, type: FooDogNodeType, source: string, lineNumber: number, depth: number, name?: string): FooDogNode {
    return new GenericFooDogNode(val, type, source, lineNumber, depth, name);
  }

  static createTagNode(val: string, source: string, lineNumber: number, depth: number, name?: string): FooDogNode {
    return new TagFooDogNode(val, source, lineNumber, depth, name);
  }
}

// Visitor interface
interface TypeVisitor {
  visitGenericNode(node: GenericFooDogNode, xpath: string): void;
  visitTagNode(node: TagFooDogNode, xpath: string): void;
}

// Concrete visitor implementing Visitor interface
class GenericTypeVisitor implements TypeVisitor {
  visitGenericNode(node: GenericFooDogNode, xpath: string) {
    console.log(`Handling basic node with val: ${node.val}, source: ${node.source}, lineNumber: ${node.lineNumber}, depth: ${node.depth}, XPath: ${xpath}`);
  }

  visitTagNode(node: TagFooDogNode, xpath: string) {
    if (!node.val && node.children.length === 0) {
      throw new Error(`Tag node must have either 'val' or 'children' attribute. Node: ${JSON.stringify(node)}, XPath: ${xpath}`);
    }
    console.log(`Handling tag node with name: ${node.name}, source: ${node.source}, lineNumber: ${node.lineNumber}, depth: ${node.depth}, XPath: ${xpath}`);

    // Handle the content
    let innerHTML = node.children.length > 0 ? node.children.map((child, index) => {
      const childXPath = `${xpath}/children[${index + 1}]`;
      return child.accept(this, childXPath);
    }).join('') : node.val;

    return `<${node.name}>${innerHTML}</${node.name}>`;
  }
}

// TagHandler for generating HTML strings
class TagTypeVisitor implements TypeVisitor {
  collectedValues: string[];

  constructor() {
    this.collectedValues = [];
  }

  visitGenericNode(node: GenericFooDogNode, xpath: string) {
    // Not used in this implementation
  }

  visitTagNode(node: TagFooDogNode, xpath: string) {
    if (!node.val && node.children.length === 0) {
      throw new Error(`Tag node must have either 'val' or 'children' attribute. Node: ${JSON.stringify(node)}, XPath: ${xpath}`);
    }
    console.log(`Handling tag node with name: ${node.name}, source: ${node.source}, lineNumber: ${node.lineNumber}, depth: ${node.depth}, XPath: ${xpath}`);

    // Handle the content
    let innerHTML = node.children.length > 0 ? node.children.map((child, index) => {
      const childXPath = `${xpath}/children[${index + 1}]`;
      return child.accept(this, childXPath);
    }).join('') : node.val;

    const tagString = `<${node.name}>${innerHTML}</${node.name}>`;
    this.collectedValues.push(tagString);
    return tagString;
  }

  getCollectedValues(): string[] {
    return this.collectedValues;
  }
}

// Example usage
const jsonObject = {
  val: "root",
  type: "rootType",
  source: "rootSource",
  lineNumber: 1,
  depth: 0,
  children: [
    {
      val: "child1",
      type: "tag",
      name: "div",
      source: "childSource1",
      lineNumber: 2,
      depth: 1,
      children: [
        {
          val: "grandchild1",
          type: "tag",
          name: "span",
          source: "grandchildSource1",
          lineNumber: 3,
          depth: 2,
          children: []
        }
      ]
    },
    {
      val: "child2",
      type: "tag",
      name: "div",
      source: "childSource2",
      lineNumber: 4,
      depth: 1,
      children: [
        {
          type: "tag",
          name: "span",
          source: "grandchildSource2",
          lineNumber: 5,
          depth: 2,
          children: []
        }
      ]
    },
    {
      val: "child3",
      type: "tag",
      source: "childSource3",
      lineNumber: 6,
      depth: 1,
      children: []
    }
  ]
};

function jsonToFooDogNode(json: any): FooDogNode {
  let node: FooDogNode;

  if (json.type === 'tag') {
    node = FooDogNodeFactory.createTagNode(json.val, json.source, json.lineNumber, json.depth, json.name);
  } else {
    node = FooDogNodeFactory.createBasicNode(json.val, json.type, json.source, json.lineNumber, json.depth, json.name);
  }

  if (json.children) {
    json.children.forEach((childJson: any, index: number) => {
      const childXPath = `${index + 1}`;
      node.addChild(jsonToFooDogNode(childJson));
    });
  }

  return node;
}

const rootNode = jsonToFooDogNode(jsonObject);

// Visit the tree with TypeHandler
const typeHandler = new GenericTypeVisitor();
rootNode.accept(typeHandler, '/');

// Visit the tree with TagHandler to collect HTML strings
const tagHandler = new TagTypeVisitor();
rootNode.accept(tagHandler, '/');
console.log(tagHandler.getCollectedValues());

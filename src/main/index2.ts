type FooDogNodeType = 'rootType' | 'tag' | 'nonTagType';

interface FooDogNode {
  val: string;
  type: FooDogNodeType;
  name?: string;
  source: string;
  lineNumber: number;
  depth: number;
  children: FooDogNode[];
  addChild(child: FooDogNode): void;
}

class FooDogNodeFactory {
  private static BasicFooDogNode = class implements FooDogNode {
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
  };

  static createNode(val: string, type: FooDogNodeType, source: string, lineNumber: number, depth: number, name?: string): FooDogNode {
    return new this.BasicFooDogNode(val, type, source, lineNumber, depth, name);
  }
}

class TypeHandler {
  handle(node: FooDogNode): string {
    throw new Error(`No code to handle node with val: ${node.val}, source: ${node.source}, lineNumber: ${node.lineNumber}, depth: ${node.depth}`)
  }

  visit(node: FooDogNode | null, xpath: string = '/'): string {
    if (!node) return '';

    // Create an appropriate handler for the current node
    let handler: TypeHandler;
    if (node.type === 'tag') {
      if (!node.val && node.children.length === 0) {
        throw new Error(`Tag node must have either 'val' or 'children' attribute. Node: ${JSON.stringify(node)}, XPath: ${xpath}`);
      }
      handler = new TagHandler();
    } else {
      handler = new TypeHandler();
    }

    // Handle the current node and collect the result
    let result = handler.handle(node);

    // Recursively visit each child and collect their results
    for (let i = 0; i < node.children.length; i++) {
      const childXPath = `${xpath}/children[${i + 1}]`;
      result += handler.visit(node.children[i], childXPath);
    }

    return result;
  }
}

class TagHandler extends TypeHandler {
  collectedValues: string[];

  constructor() {
    super();
    this.collectedValues = [];
  }

  handle(node: FooDogNode): string {
    if (node.type === 'tag') {
      if (!node.val && node.children.length === 0) {
        throw new Error(`Tag node must have either 'val' or 'children' attribute. Node: ${JSON.stringify(node)}`);
      }
      // Collect the HTML representation
      const innerHTML = node.children.length > 0 ? node.children.map(child => this.nodeToHTML(child)).join('') : node.val;
      const tagString = `<${node.name}>${innerHTML}</${node.name}>`;
      this.collectedValues.push(tagString);
      return tagString;
    } else {
      // Delegate to the parent class for non-tag nodes
      return super.handle(node);
    }
  }

  nodeToHTML(node: FooDogNode): string {
    if (node.type === 'tag') {
      const innerHTML = node.children.length > 0 ? node.children.map(child => this.nodeToHTML(child)).join('') : node.val;
      return `<${node.name}>${innerHTML}</${node.name}>`;
    } else {
      return node.val;
    }
  }

  getCollectedValues(): string[] {
    return this.collectedValues;
  }
}

function jsonToFooDogNode(json: any): FooDogNode {
  const node = FooDogNodeFactory.createNode(json.val, json.type, json.source, json.lineNumber, json.depth, json.name);
  if (json.children) {
    json.children.forEach((childJson: any) => {
      node.addChild(jsonToFooDogNode(childJson));
    });
  }
  return node;
}

// Example usage:

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
      type: "nonTagType",
      source: "childSource3",
      lineNumber: 6,
      depth: 1,
      children: []
    }
  ]
};

const rootNode = jsonToFooDogNode(jsonObject);

const mainHandler = new TypeHandler();
try {
  const resultString = mainHandler.visit(rootNode);
  console.log(resultString);
} catch (error: any) {
  console.error(error.message);
}

// // For this example, we'll manually create a TagHandler to retrieve collected values.
// const tagHandler = new TagHandler();
// try {
//   tagHandler.visitTree(rootNode);
//   console.log(tagHandler.getCollectedValues());
// } catch (error: any) {
//   console.error(error.message);
// }

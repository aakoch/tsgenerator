var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AbstractFooDogNode = /** @class */ (function () {
    function AbstractFooDogNode(val, type, source, lineNumber, depth, name) {
        this.val = val;
        this.type = type;
        this.name = name;
        this.source = source;
        this.lineNumber = lineNumber;
        this.depth = depth;
        this.children = [];
    }
    AbstractFooDogNode.prototype.addChild = function (child) {
        this.children.push(child);
    };
    return AbstractFooDogNode;
}());
var GenericFooDogNode = /** @class */ (function (_super) {
    __extends(GenericFooDogNode, _super);
    function GenericFooDogNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GenericFooDogNode.prototype.accept = function (visitor, xpath) {
        visitor.visitGenericNode(this, xpath);
    };
    return GenericFooDogNode;
}(AbstractFooDogNode));
// Concrete implementation of TagFooDogNode
var TagFooDogNode = /** @class */ (function (_super) {
    __extends(TagFooDogNode, _super);
    function TagFooDogNode(val, source, lineNumber, depth, name) {
        return _super.call(this, val, 'tag', source, lineNumber, depth, name) || this;
    }
    TagFooDogNode.prototype.addChild = function (child) {
        this.children.push(child);
    };
    TagFooDogNode.prototype.accept = function (visitor, xpath) {
        visitor.visitTagNode(this, xpath);
    };
    return TagFooDogNode;
}(GenericFooDogNode));
// Factory class to create FooDogNodes
var FooDogNodeFactory = /** @class */ (function () {
    function FooDogNodeFactory() {
    }
    FooDogNodeFactory.createBasicNode = function (val, type, source, lineNumber, depth, name) {
        return new GenericFooDogNode(val, type, source, lineNumber, depth, name);
    };
    FooDogNodeFactory.createTagNode = function (val, source, lineNumber, depth, name) {
        return new TagFooDogNode(val, source, lineNumber, depth, name);
    };
    return FooDogNodeFactory;
}());
// Concrete visitor implementing Visitor interface
var GenericTypeVisitor = /** @class */ (function () {
    function GenericTypeVisitor() {
    }
    GenericTypeVisitor.prototype.visitGenericNode = function (node, xpath) {
        console.log("Handling basic node with val: ".concat(node.val, ", source: ").concat(node.source, ", lineNumber: ").concat(node.lineNumber, ", depth: ").concat(node.depth, ", XPath: ").concat(xpath));
    };
    GenericTypeVisitor.prototype.visitTagNode = function (node, xpath) {
        var _this = this;
        if (!node.val && node.children.length === 0) {
            throw new Error("Tag node must have either 'val' or 'children' attribute. Node: ".concat(JSON.stringify(node), ", XPath: ").concat(xpath));
        }
        console.log("Handling tag node with name: ".concat(node.name, ", source: ").concat(node.source, ", lineNumber: ").concat(node.lineNumber, ", depth: ").concat(node.depth, ", XPath: ").concat(xpath));
        // Handle the content
        var innerHTML = node.children.length > 0 ? node.children.map(function (child, index) {
            var childXPath = "".concat(xpath, "/children[").concat(index + 1, "]");
            return child.accept(_this, childXPath);
        }).join('') : node.val;
        return "<".concat(node.name, ">").concat(innerHTML, "</").concat(node.name, ">");
    };
    return GenericTypeVisitor;
}());
// TagHandler for generating HTML strings
var TagTypeVisitor = /** @class */ (function () {
    function TagTypeVisitor() {
        this.collectedValues = [];
    }
    TagTypeVisitor.prototype.visitGenericNode = function (node, xpath) {
        // Not used in this implementation
    };
    TagTypeVisitor.prototype.visitTagNode = function (node, xpath) {
        var _this = this;
        if (!node.val && node.children.length === 0) {
            throw new Error("Tag node must have either 'val' or 'children' attribute. Node: ".concat(JSON.stringify(node), ", XPath: ").concat(xpath));
        }
        console.log("Handling tag node with name: ".concat(node.name, ", source: ").concat(node.source, ", lineNumber: ").concat(node.lineNumber, ", depth: ").concat(node.depth, ", XPath: ").concat(xpath));
        // Handle the content
        var innerHTML = node.children.length > 0 ? node.children.map(function (child, index) {
            var childXPath = "".concat(xpath, "/children[").concat(index + 1, "]");
            return child.accept(_this, childXPath);
        }).join('') : node.val;
        var tagString = "<".concat(node.name, ">").concat(innerHTML, "</").concat(node.name, ">");
        this.collectedValues.push(tagString);
        return tagString;
    };
    TagTypeVisitor.prototype.getCollectedValues = function () {
        return this.collectedValues;
    };
    return TagTypeVisitor;
}());
// Example usage
var jsonObject = {
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
function jsonToFooDogNode(json) {
    var node;
    if (json.type === 'tag') {
        node = FooDogNodeFactory.createTagNode(json.val, json.source, json.lineNumber, json.depth, json.name);
    }
    else {
        node = FooDogNodeFactory.createBasicNode(json.val, json.type, json.source, json.lineNumber, json.depth, json.name);
    }
    if (json.children) {
        json.children.forEach(function (childJson, index) {
            var childXPath = "".concat(index + 1);
            node.addChild(jsonToFooDogNode(childJson));
        });
    }
    return node;
}
var rootNode = jsonToFooDogNode(jsonObject);
// Visit the tree with TypeHandler
var typeHandler = new GenericTypeVisitor();
rootNode.accept(typeHandler, '/');
// Visit the tree with TagHandler to collect HTML strings
var tagHandler = new TagTypeVisitor();
rootNode.accept(tagHandler, '/');
console.log(tagHandler.getCollectedValues());

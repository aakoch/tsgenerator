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
var FooDogNodeFactory = /** @class */ (function () {
    function FooDogNodeFactory() {
    }
    FooDogNodeFactory.createNode = function (val, type, source, lineNumber, depth, name) {
        return new this.BasicFooDogNode(val, type, source, lineNumber, depth, name);
    };
    FooDogNodeFactory.BasicFooDogNode = /** @class */ (function () {
        function class_1(val, type, source, lineNumber, depth, name) {
            this.val = val;
            this.type = type;
            this.name = name;
            this.source = source;
            this.lineNumber = lineNumber;
            this.depth = depth;
            this.children = [];
        }
        class_1.prototype.addChild = function (child) {
            this.children.push(child);
        };
        return class_1;
    }());
    return FooDogNodeFactory;
}());
var TypeHandler = /** @class */ (function () {
    function TypeHandler() {
    }
    TypeHandler.prototype.handleNode = function (node) {
        return "Handling node with val: ".concat(node.val, ", source: ").concat(node.source, ", lineNumber: ").concat(node.lineNumber, ", depth: ").concat(node.depth);
    };
    TypeHandler.prototype.visitTree = function (node, xpath) {
        if (xpath === void 0) { xpath = '/'; }
        if (!node)
            return '';
        // Create an appropriate handler for the current node
        var handler;
        if (node.type === 'tag') {
            if (!node.val && node.children.length === 0) {
                throw new Error("Tag node must have either 'val' or 'children' attribute. Node: ".concat(JSON.stringify(node), ", XPath: ").concat(xpath));
            }
            handler = new TagHandler();
        }
        else {
            handler = new TypeHandler();
        }
        // Handle the current node and collect the result
        var result = handler.handleNode(node);
        // Recursively visit each child and collect their results
        for (var i = 0; i < node.children.length; i++) {
            var childXPath = "".concat(xpath, "/children[").concat(i + 1, "]");
            result += handler.visitTree(node.children[i], childXPath);
        }
        return result;
    };
    return TypeHandler;
}());
var TagHandler = /** @class */ (function (_super) {
    __extends(TagHandler, _super);
    function TagHandler() {
        var _this = _super.call(this) || this;
        _this.collectedValues = [];
        return _this;
    }
    TagHandler.prototype.handleNode = function (node) {
        var _this = this;
        if (node.type === 'tag') {
            if (!node.val && node.children.length === 0) {
                throw new Error("Tag node must have either 'val' or 'children' attribute. Node: ".concat(JSON.stringify(node)));
            }
            // Collect the HTML representation
            var innerHTML = node.children.length > 0 ? node.children.map(function (child) { return _this.nodeToHTML(child); }).join('') : node.val;
            var tagString = "<".concat(node.name, ">").concat(innerHTML, "</").concat(node.name, ">");
            this.collectedValues.push(tagString);
            return tagString;
        }
        else {
            // Delegate to the parent class for non-tag nodes
            return _super.prototype.handleNode.call(this, node);
        }
    };
    TagHandler.prototype.nodeToHTML = function (node) {
        var _this = this;
        if (node.type === 'tag') {
            var innerHTML = node.children.length > 0 ? node.children.map(function (child) { return _this.nodeToHTML(child); }).join('') : node.val;
            return "<".concat(node.name, ">").concat(innerHTML, "</").concat(node.name, ">");
        }
        else {
            return node.val;
        }
    };
    TagHandler.prototype.getCollectedValues = function () {
        return this.collectedValues;
    };
    return TagHandler;
}(TypeHandler));
function jsonToFooDogNode(json) {
    var node = FooDogNodeFactory.createNode(json.val, json.type, json.source, json.lineNumber, json.depth, json.name);
    if (json.children) {
        json.children.forEach(function (childJson) {
            node.addChild(jsonToFooDogNode(childJson));
        });
    }
    return node;
}
// Example usage:
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
            type: "nonTagType",
            source: "childSource3",
            lineNumber: 6,
            depth: 1,
            children: []
        }
    ]
};
var rootNode = jsonToFooDogNode(jsonObject);
var mainHandler = new TypeHandler();
try {
    var resultString = mainHandler.visitTree(rootNode);
    console.log(resultString);
}
catch (error) {
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

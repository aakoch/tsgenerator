import t from 'tap'
// import { CliTransformer } from '../cliTransformer.js'
import {FooDogNode} from "../main/@foo-dog/foo-dog-node.js";
import {TypeHandlerFactory} from "../main/type-handler-factory.js";
import {TypeHandler} from "../main/@foo-dog/type-handler.js";
import {RootTypeHandler} from "../main/root-handler.js";


t.test('simple mixin', t => {

  let node = [
    {
      "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/mixin_simple.pug",
      "type": "mixin",
      "val": "header(text)",
      "lineNumber": 1,
      "children": [
        {
          "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/mixin_simple.pug",
          "name": "h1",
          "type": "tag",
          "val": "inline title",
          "lineNumber": 2,
          "depth": 2
        }
      ],
      "depth": 1
    },
    {
      "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/mixin_simple.pug",
      "type": "mixin_call",
      "name": "header",
      "lineNumber": 4,
      "depth": 1
    }
  ] as unknown as FooDogNode[];


  let node1: FooDogNode = {
    addChild(fooDogNode: FooDogNode): void {
    }, getHandler(): TypeHandler {
      return new RootTypeHandler(this);
    },
    type: 'rootType', children: node
  };
  let typeHandler = TypeHandlerFactory.createHandler(node1, 'test');

  t.equal(typeHandler.handle(node1, 'test xpath')(), '<h1>inline title</h1>')
  t.end()
});

t.test('basic mixin', t => {

  let node = [
    {
      "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/mixin_simple.pug",
      "type": "mixin",
      "val": "header2(text)",
      "lineNumber": 1,
      "children": [
        {
          "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/mixin_simple.pug",
          "name": "h1",
          "type": "tag",
          "assignment": true,
          "val": "title",
          "lineNumber": 2,
          "depth": 2
        }
      ],
      "depth": 1
    },
    {
      "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/mixin_simple.pug",
      "type": "mixin_call",
      "name": "header2",
      "params": "\"test\"",
      "lineNumber": 4,
      "depth": 1
    }
  ] as unknown as FooDogNode[];


  let node1: FooDogNode = {
    addChild(fooDogNode: FooDogNode): void {
    }, getHandler(): TypeHandler {
      return new RootTypeHandler(this);
    },
    type: 'rootType', children: node
  };
  let typeHandler = TypeHandlerFactory.createHandler(node1, 'test');

  t.equal(typeHandler.handle(node1, 'test xpath')(), '<h1>test</h1>')
  t.end()
});

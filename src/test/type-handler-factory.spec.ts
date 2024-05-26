import t from 'tap'
// import { CliTransformer } from '../cliTransformer.js'
import {Generator} from '../main/index.js'
import {FooDogNode} from "../main/@foo-dog/foo-dog-node.js";
import {TypeHandlerFactory} from "../main/type-handler-factory.js";

t.test('assigning a variable to a tag', t => {
  let node = {
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/mixin_simple.pug",
    "name": "h1",
    "type": "tag",
    "assignment": true,
    "val": "title",
    "lineNumber": 2,
    "depth": 2
  } as unknown as FooDogNode;
  let typeHandler = TypeHandlerFactory.createHandler(node, 'test');
  t.equal(typeHandler.handle(node, 'xpath')("test title").trim(), '<h1>test title</h1>')
  t.end()
});

// t.test('assigning a variable to a tag', t => {
//   let node = {
//     "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/mixin_simple.pug",
//     "name": "h1",
//     "type": "tag",
//     "val": "title",
//     "lineNumber": 2,
//     "depth": 2
//   } as unknown as FooDogNode;
//   let typeHandler = TypeHandlerFactory.createHandler(node, 'test');
//   t.equal(typeHandler.handle(node, 'xpath')("test title").trim(), '<h1>test title</h1>')
//   t.end()
// });


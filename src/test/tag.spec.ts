import t from 'tap'
// import { CliTransformer } from '../cliTransformer.js'
import {Generator} from '../main/index.js'
import { FooDogNode } from '@foo-dog/types';

t.setTimeout(1000000)
t.test('basic tag test with no attributes', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    name: "h1",
    type: "tag",
    val: "Title test"
  } as FooDogNode), '<h1>Title test</h1>')
  t.end()
});

t.test('nested tag test', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/basic.pug",
    "name": "body",
    "type": "tag",
    "lineNumber": 2,
    "children": [
      {
        "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/basic.pug",
        "name": "h2",
        "type": "tag",
        "val": "Title",
        "lineNumber": 3,
        "depth": 3
      }
    ],
    "depth": 2
  } as unknown as FooDogNode), '<body><h2>Title</h2></body>')
  t.end()
});

// t.setTimeout(1000000)
t.test('doubly-nested tag test', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/basic.pug",
    "name": "body",
    "type": "tag",
    "lineNumber": 2,
    "children": [
      {
        "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/basic.pug",
        "name": "h2",
        "type": "tag",
        "val": "Title",
        "lineNumber": 3,
        "children": [
          {
            "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/basic.pug",
            "name": "span",
            "type": "tag",
            "val": "Title2",
            "lineNumber": 3,
            "depth": 3
          }
        ],
        "depth": 3
      }
    ],
    "depth": 2
  } as unknown as FooDogNode), '<body><h2><span>Title2</span>Title</h2></body>')
  t.end()
});


t.test('basic.json tag test', async t => {
  const g = new Generator();
  t.equal(await g.fromJson([
    {
      "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/basic.pug",
      "name": "html",
      "type": "tag",
      "lineNumber": 1,
      "children": [
        {
          "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/basic.pug",
          "name": "body",
          "type": "tag",
          "lineNumber": 2,
          "children": [
            {
              "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/basic.pug",
              "name": "h1",
              "type": "tag",
              "val": "Title",
              "lineNumber": 3,
              "depth": 3
            }
          ],
          "depth": 2
        }
      ],
      "depth": 1
    }
  ] as unknown as FooDogNode[]), '<html><body><h1>Title</h1></body></html>')
  t.end()
});

// t.test('async tests work like you would expect', async t => {
//   t.equal(await myThing.Transform, 'whatever')
//   // don't have to call t.end(), it'll just end when the
//   // async stuff is all resolved.
// })


t.test('null', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/code.pug",
    "name": "p",
    "type": "tag",
    "assignment": true,
    "val": "null",
    "lineNumber": 1,
    "depth": 1
  } as unknown as FooDogNode), '<p></p>')
  t.end()
});

t.test('undefined', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/code.pug",
    "name": "p",
    "type": "tag",
    "assignment": true,
    "val": "undefined",
    "lineNumber": 2,
    "depth": 1
  } as unknown as FooDogNode), '<p></p>')
  t.end()
});

t.test('false', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/code.pug",
    "name": "p",
    "type": "tag",
    "assignment": true,
    "val": "false",
    "lineNumber": 2,
    "depth": 1
  } as unknown as FooDogNode), '<p></p>')
  t.end()
});

t.test('0', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/code.pug",
    "name": "p",
    "type": "tag",
    "assignment": true,
    "val": "0",
    "lineNumber": 2,
    "depth": 1
  } as unknown as FooDogNode), '<p></p>')
  t.end()
});

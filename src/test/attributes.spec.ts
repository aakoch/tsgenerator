import t from 'tap'
import {Generator} from '../main/index.js'
import {FooDogNode} from "../main/@foo-dog/foo-dog-node.js";

t.test('attributes', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/attrs.pug",
    "name": "a",
    "type": "tag",
    "attrs": [
      {
        "name": "href",
        "val": "/contact"
      }
    ],
    "val": "contact",
    "lineNumber": 1,
    "depth": 1
  } as unknown as FooDogNode), '<a href="/contact">contact</a>')
  t.end()
});

t.test('attributes', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/attrs.pug",
    "name": "foo",
    "type": "tag",
    "attrs_start": [
      {
        "name": "abc"
      }
    ],
    "lineNumber": 25,
    "children": [
      {
        "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/attrs.pug",
        "type": "attrs_end",
        "val": [
          {
            "name": "def"
          }
        ],
        "lineNumber": 26,
        "depth": 2
      }
    ],
    "depth": 1
  } as unknown as FooDogNode), '<foo abc="abc" def="def"></foo>')
  t.end()
});

import t from 'tap'
import {Generator} from '../main/index.js'
import { FooDogNode } from '@foo-dog/types';

// t.test('unbuf code 1', async t => {
//   const g = new Generator();
//   t.equal(await g.fromJson({
//     name: "h1",
//     type: "unbuf_code",
//     val: "Title test"
//   } as FooDogNode), '<h1>Title test</h1>')
//   t.end()
// });

t.test('unbuf code 1', async t => {
  const g = new Generator();
  t.equal(await g.fromJson([{
        "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/case.pug",
        "type": "unbuf_code",
        "val": "var friends = 1",
        "lineNumber": 3,
        "depth": 3
      },
      {
        "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/case.pug",
        "type": "case",
        "val": "friends",
        "lineNumber": 4,
        "children": [
          {
            "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/case.pug",
            "type": "when",
            "val": "0: p you have no friends",
            "lineNumber": 5,
            "depth": 4
          },
          {
            "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/case.pug",
            "type": "when",
            "val": "1: p you have a friend",
            "lineNumber": 6,
            "depth": 4
          },
          {
            "source": "/Users/aakoch/projects/foo-dog/workspaces/lexing-transformer/build/in/case.pug",
            "type": "default",
            "val": ": p you have #{friends} friends",
            "lineNumber": 7,
            "depth": 4
          }
        ],
        "depth": 3
      }] as unknown as FooDogNode[]), '<p>you have a friend</p>')
  t.end()
});


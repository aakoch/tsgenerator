import t from 'tap'
// import { CliTransformer } from '../cliTransformer.js'
import { Generator } from '../main/index.js'

t.test('basic tag test with no attributes', t => {
  const g = new Generator();
  t.equal(g.fromJson({
    name: "h1",
    type: "tag",
    val: "Title test"
  }), '<h1>Title test</h1>')
  t.end()
});

t.test('nested tag test', t => {
  const g = new Generator();
  t.equal(g.fromJson({
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
  }), '<body><h2>Title</h2></body>')
  t.end()
});

// t.setTimeout(1000000)
t.test('doubly-nested tag test', t => {
  const g = new Generator();
  t.equal(g.fromJson({
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
            "val": "Title",
            "lineNumber": 3,
            "depth": 3
          }],
        "depth": 3
      }
    ],
    "depth": 2
  }), '<body><h2><span>Title</span></h2></body>')
  t.end()
});

// t.test('async tests work like you would expect', async t => {
//   t.equal(await myThing.Transform, 'whatever')
//   // don't have to call t.end(), it'll just end when the
//   // async stuff is all resolved.
// })
import t from 'tap'
import {Generator} from '../main/index.js'
import {FooDogNode} from "../main/@foo-dog/foo-dog-node.js";

t.test('unbuf code 1', async t => {
  const g = new Generator();
  t.equal(await g.fromJson({
    name: "h1",
    type: "unbuf_code",
    val: "Title test"
  } as FooDogNode), '<h1>Title test</h1>')
  t.end()
});

import t from 'tap'
import debugFunc from 'debug'

const debug = debugFunc('generator:run.spec.ts')

// import * as adam from '@tapjs/tsx'
import {compile, run} from '../main/run.js'

t.test('test simple return', t => {
  let func = compile("return a", ['a'])
  let r = func("some string")
  t.equal(r, "some string")
  t.end()
});

t.test('test simple return using returnArray', t => {
  let func = compile("retArr.push(a)", ['a'], 'retArr')
  let r = func("some string")
  t.equal(r, "some string")
  t.end()
});

t.test('test simple return without variables', t => {
  let func = compile("return 'some string'")
  let r = func("obviously not the correct string")
  t.equal(r, "some string")
  t.end()
});

t.test('test simple addition', t => {
  let func = compile("return 1 + 2")
  let r = func("obviously not the correct answer")
  t.equal(r, 3)
  t.end()
});

t.test('test creating a tag', t => {
  let func = compile(`let tag = '<a href=\\"\\"></a>'; return tag;`)
  let r = func("obviously not the correct string")
  debug("r=" + r)
  t.equal(r, "<a href=\"\"></a>")
  t.end()
});

t.test('test creating a tag using the run method', t => {
  let r = run(`let tag = '<a href=\\"\\"></a>'; return tag;`)
  debug("r=" + r)
  t.equal(r, "<a href=\"\"></a>")
  t.end()
});

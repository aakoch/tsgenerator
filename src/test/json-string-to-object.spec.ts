import t from 'tap'
import jsonStringToObject from '../main/json-string-to-object.js'

t.test('async tests work like you would expect', async t => {
  t.same(await jsonStringToObject(`{ "some": "value" }`), { "some": "value" })
})

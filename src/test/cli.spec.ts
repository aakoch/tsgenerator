import t from 'tap'
// import {Generator} from '../index.js'
import {printUsage} from '../cliHelper.js'

t.test('print usage test', t => {

  let originalConsoleLog = console.log

  // Mock console.log
  console.log = function (message) {
    t.ok(message.includes('Generator'))
    console.log = originalConsoleLog;
  };

  printUsage(console);

  originalConsoleLog("test")
  t.end();

});

// t.test('async tests work like you would expect', async t => {
//
//   run().then(() => {
//     t.pass('asyncTask completed successfully');
//     t.end();
//   }).catch((err) => {
//     t.fail(`asyncTask failed with error: ${err}`);
//     t.end();
//   });
// });

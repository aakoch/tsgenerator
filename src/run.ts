import {inspect} from "util";
import debugFunc from 'debug'

const debug = debugFunc('generator:run')

const compile = function (code: string, variables?: string[], arrayName = 'returnArray') {
  let functionString = 'let ' + arrayName + ' = []; ' + code + '; return ' + arrayName + '.join("")';
  debug("functionString=", functionString)

  let func: Function;
  if (variables) {
    func = new Function(...variables, functionString);
  } else {
    func = new Function(functionString);
  }
  debug('func=', func.toString())
  return func;
}

const run = function (code: string, variables?: string[], arrayName = 'returnArray') {
  try {
    const func = compile(code, variables, arrayName)
    const result = func(Object.values(variables ?? {}))
    debug('result=', result)
    return result
  } catch (e) {
    throw new EvalError("Could not evaluate: " + code + " with variables = " + inspect(variables))
  }
}

export {
  compile,
  run
}

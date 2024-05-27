import {inspect} from "util";
import debugFunc from 'debug'
import {deprecate} from "node:util";

const debug = debugFunc('tsgenerator:run')

const evil = function evil(fn: any) {
  return new Function('return ' + fn)();
}

const compile = deprecate(function (code: string, variables: string[] = [], arrayName: string = 'returnArray') {

  let functionString
  if (variables === undefined) {
    functionString = 'return (function() { return ' + code + ' })()';
  } else {
    functionString = 'return (function() { let ' + arrayName + ' = []; ' + code + '; return ' + arrayName + '.join("")})()';
  }

  let func: Function;
  debug("...variables=", ...variables)
  if (variables.length > 0) {
    func = Function(...variables, functionString);
  } else {
    func = new Function(functionString);
  }

  debug('func=', func.toString())
  return func;
}, 'please use compile_new')

const compile_new = function (code: string, variables: string[] = [], arrayName = 'returnArray'): Function & {
  withVar: Function
} {

  let functionString = 'return (function() { ' + code + ' })()';
  
  debug('functionString=', functionString.toString())
  debug("...variables=", ...variables)

  let func: Function;
  if (variables.length > 0) {
    func = Function(...variables, functionString);
  } else {
    func = new Function(functionString);
  }

  debug('func=', func.toString())

  const withVar = function (args: any[]) {
    return func(evil(args));
  }

  return Object.assign(func, {withVar: withVar});
}

const run = function (code: string, variables?: string[] | object, arrayName = 'returnArray') {
  try {
    let func;
    if (variables) {
      func = compile_new(code, Array.isArray(variables) ? variables : Object.keys(variables as object), arrayName)
    } else {
      func = compile_new(code)
    }
    const result = func(Object.values(variables ?? {}))
    debug('result=', result)
    return result
  } catch (e) {
    console.error(e)
    throw new EvalError("Could not evaluate: " + code + " with variables = " + inspect(variables))
  }
}

export {
  compile,
  compile_new,
  run,
  evil
}

import {Mixin} from "./@foo-dog/foo-dog-node.js";
import debugFunc from "debug";
const debug = debugFunc("tsgenerator: GenericMixin")

//export 
class GenericMixin implements Mixin {
  attrs?: string[];
  func?: Function;
  public name!: string;

  call(...args: any[]): string {
    debug('func=',(this.func ?? "bogus").toString())
    if (this.func === undefined) {
      return "function missing"
    }
    else {
      return this.func(args);
    }
  }
  
  toString(): string {
    return (this.func ?? "[null]").toString()
  }
  
}
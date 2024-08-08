import debugFunc from "debug";
import {Mixin} from "@foo-dog/types/dist/index.js";

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
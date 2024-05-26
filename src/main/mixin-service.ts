import {inspect} from "util";
import debugFunc from "debug";
import {Mixin} from "./@foo-dog/foo-dog-node.js";
// import {GenericMixin} from "./generic-mixin.js";
const debug = debugFunc("tsgenerator: mixin-service")

class MixinService {
  private map: { [key: string]: Function }; 
  private rand: number;
  
  constructor() {
    this.rand = Math.random();
    this.map = {};
  }
  
  findMixin(name: string) : Function | undefined {
    debug(this.rand.toString(10) + ": returning mixin \"" + name + "\"=", this.map[name])
    return this.map[name];
  }

  registerMixin(name: string, mixin: Function) {
    if (name === undefined || mixin === undefined) {
      throw new Error("Cannot pass undefined parameters")
    }
    if (this.map.hasOwnProperty(name)) {
      throw new Error("Duplicate mixin names not supported. Duplicated name: " + name);
    }
    debug(this.rand.toString(10) + ": registering mixin \"" + name + "\"=", mixin.toString())
    this.map[name] = mixin;
  }
}

export default new MixinService();
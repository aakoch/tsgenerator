// dom-interfaces.ts

export interface EventTarget {}
export interface Node extends EventTarget {}
export interface Text extends Node {}
export interface Comment extends Node {}
export interface Element extends Node {}
export interface HTMLElement extends Element {
  children: any;
  val: any;
  name: any;
  outerHTML: string;
  innerHTML: any;
}
export interface SVGElement extends Element {}
export interface Document extends Node {}
export interface DocumentFragment extends Node {}
export interface DocumentType extends Node {}
export interface HTMLInputElement extends HTMLElement {}
export interface HTMLDivElement extends HTMLElement {}

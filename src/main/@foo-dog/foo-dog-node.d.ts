export type FooDogNodeType = 'rootType' | 'tag' | 'nonTagType' | 'text' | "html_comment" | "unbuf_code" | "comment" | "attrs_end" | 'doctype' | 'mixin' | 'mixin_call';

export interface Attribute {
  name: string;
  val: string;
}

export interface FooDogNode {
  name?: string;
  assignment?: boolean;
  type: FooDogNodeType;
  val?: string | Attribute[];
  source?: string; // optional for testing for now
  lineNumber?: number; // optional for testing for now
  children?: FooDogNode[];
  depth?: number // optional for testing for now
  attrs?: Attribute[];
  getHandler(): TypeHandler;
  addChild(fooDogNode: FooDogNode): void;
  
  // mixin calls provide "params" instead of "val"
  params?: any[];
  
  attrs_start?: Attribute[];
  attrs_end?: Attribute[];
}

export interface Mixin {
  call(...args): string;
  name?: string;
}
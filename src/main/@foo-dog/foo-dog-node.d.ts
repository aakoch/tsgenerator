export type FooDogNodeType = 'rootType' | 'tag' | 'nonTagType' | 'text';

export interface Attribute {
  
}

export interface FooDogNode {
  name?: string;
  type: FooDogNodeType;
  val?: string;
  source?: string; // optional for testing for now
  lineNumber?: number; // optional for testing for now
  children?: FooDogNode[];
  depth?: number // optional for testing for now
  attrs?: Attribute[];
  getHandler(): TypeHandler;
  addChild(fooDogNode: FooDogNode): void;
}
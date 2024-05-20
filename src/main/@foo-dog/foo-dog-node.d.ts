export type FooDogNodeType = 'rootType' | 'tag' | 'nonTagType';

export interface FooDogNode {
  name?: string;
  type: FooDogNodeType;
  val?: string;
  source?: string; // optional for testing for now
  lineNumber?: number; // optional for testing for now
  children?: FooDogNode[];
  depth?: number // optional for testing for now
  getHandler(): TypeHandler;
  addChild(fooDogNode: FooDogNode): void;
}
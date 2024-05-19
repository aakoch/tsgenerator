export interface TypeHandler {
  handle(node: FooDogNode): string
  visit(node: FooDogNode | null, xpath: string = '/'): string
}
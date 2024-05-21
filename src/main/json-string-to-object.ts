export default async function jsonStringToObject(str: string): Promise<object> {
  return JSON.parse(str)
}
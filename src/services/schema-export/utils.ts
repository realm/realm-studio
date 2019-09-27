export function isPrimitive(type: string | undefined) {
  switch (type) {
    case 'bool':
    case 'int':
    case 'float':
    case 'double':
    case 'string':
    case 'data':
    case 'date':
      return true;
    default:
      return false;
  }
}

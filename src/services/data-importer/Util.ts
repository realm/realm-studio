export default class Util {
  public static isBoolean(value: string): boolean {
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
  }

  public static isInt(value: string): boolean {
    const nbr: any = Util.filterFloat(value);
    if (Number.isNaN(nbr)) {
      return false;
    } else {
      return Number.isInteger(nbr);
    }
  }

  public static isDouble(value: string): boolean {
    return !Number.isNaN(Util.filterFloat(value) as any);
  }

  private static filterFloat(value: string): number {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  }
}

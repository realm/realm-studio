export default class Util {
  public static isBoolean(value: string): boolean {
    try {
      return typeof JSON.parse(value.toLocaleLowerCase()) === 'boolean';
    } catch (e) {
      return false;
    }
  }

  public static isInt(value: string): boolean {
    try {
      const nbr = Number.parseFloat(value);
      if (isNaN(nbr)) {
        return false;
      } else {
        return Number.isInteger(nbr);
      }
    } catch (e) {
      return false;
    }
  }

  public static isDouble(value: string): boolean {
    try {
      return !isNaN(Number.parseFloat(value));
    } catch (e) {
      return false;
    }
  }
}

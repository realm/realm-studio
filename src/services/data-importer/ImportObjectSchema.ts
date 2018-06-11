export class ImportObjectSchema implements Realm.ObjectSchema {
  public name: string;
  public properties: Realm.PropertiesTypes = {};

  constructor(name: string) {
    this.name = name;
  }
}

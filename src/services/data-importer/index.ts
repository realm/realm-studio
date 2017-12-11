import * as Realm from 'realm';
import ImportSchemaGenerator from './ImportSchemaGenerator';

export enum ImportSchemaFormat {
  CSV = 'csv',
  JSON = 'json',
}

export class ImportObjectSchema implements Realm.ObjectSchema {
  public name: string;
  public properties: Realm.PropertiesTypes = {};
}

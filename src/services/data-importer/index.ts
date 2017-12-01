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

export const ImportSchemaGeneratorHelper = (
  format: ImportSchemaFormat,
  files: string[],
): ImportSchemaGenerator => {
  switch (format) {
    case ImportSchemaFormat.CSV:
      return new ImportSchemaGenerator(ImportSchemaFormat.CSV, files);
    case ImportSchemaFormat.JSON:
    default:
      throw new Error('Format not supported yet');
  }
};

import * as Realm from 'realm';

import { CSVDataImporter } from './csv/CSVDataImporter';
import ImportSchemaGenerator from './ImportSchemaGenerator';

export enum ImportFormat {
  CSV = 'csv',
  JSON = 'json',
}

export class ImportObjectSchema implements Realm.ObjectSchema {
  public name: string;
  public properties: Realm.PropertiesTypes = {};

  constructor(name: string) {
    this.name = name;
  }
}

export const getDataImporter = (
  format: ImportFormat,
  files: string[],
  importSchema: Realm.ObjectSchema[],
) => {
  if (format === ImportFormat.CSV) {
    return new CSVDataImporter(files, importSchema);
  } else {
    throw new Error('Not supported yet');
  }
};

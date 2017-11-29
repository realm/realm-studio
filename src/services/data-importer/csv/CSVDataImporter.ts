import { DataImporter } from '../DataImporter';

export default class CSVDataImporter extends DataImporter {
  public import(path: string, importSchema: Realm.ObjectSchema[]): Realm {
    throw new Error('Method not implemented.');
  }
}

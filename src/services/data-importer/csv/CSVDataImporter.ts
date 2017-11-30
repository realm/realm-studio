import fs = require('fs-extra');
import papaparse = require('papaparse');
import * as fsPath from 'path';
import { DataImporter } from '../DataImporter';

export default class CSVDataImporter extends DataImporter {
  private static readonly NUMBER_OF_INSERTS_BEFORE_COMMIT = 10000;

  public import(path: string, importSchema: Realm.ObjectSchema[]): Realm {
    const realm = this.createNewRealmFile(path, importSchema);
    this.files.map((file, index) => {
      const schema = importSchema[index];

      const rawCSV = fs.readFileSync(file, 'utf8');
      const data = papaparse.parse(rawCSV, {
        header: true, // to avoid parsing first line as data
        skipEmptyLines: true,
      }).data;

      realm.beginTransaction();
      let numberOfInsert = 0;

      data.forEach(row => {
        const object: any = {};
        for (const prop in schema.properties) {
          if (schema.properties.hasOwnProperty(prop)) {
            switch (schema.properties[prop]) {
              case 'bool?':
                object[prop] = JSON.parse(row[prop].toLocaleLowerCase()); // TODO handle parsingn error + add tests
                break;
              case 'int?':
                object[prop] = parseInt(row[prop], 10);
                break;
              case 'double?':
                object[prop] = parseFloat(row[prop]);
                break;
              default:
                // string?
                object[prop] = row[prop];
            }
          }
        }

        realm.create(schema.name, object);
        // commit by batch to avoid creating multiple transactions.
        if (
          numberOfInsert++ === CSVDataImporter.NUMBER_OF_INSERTS_BEFORE_COMMIT
        ) {
          realm.commitTransaction();
          numberOfInsert = 0;
          realm.beginTransaction();
        }
      });

      realm.commitTransaction();
    });

    return realm;
  }
}

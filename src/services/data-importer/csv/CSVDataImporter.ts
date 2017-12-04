import fs = require('fs-extra');
import fsExtra = require('fs-extra');
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
      let lineNumber = 1; // Helpful to report to user which line did fail to parse.
      data.forEach(row => {
        ++lineNumber;
        const object: any = {};
        for (const prop in schema.properties) {
          if (schema.properties.hasOwnProperty(prop) && row[prop]) {
            try {
              switch (schema.properties[prop]) {
                case 'bool?':
                  object[prop] = JSON.parse(row[prop].toLocaleLowerCase());
                  break;
                case 'int?':
                  const intNumber = parseInt(row[prop], 10);
                  if (isNaN(intNumber)) {
                    throw new Error(
                      `Can not parse ${row[prop]} as int at line ${lineNumber}`,
                    );
                  }
                  object[prop] = intNumber;
                  break;
                case 'double?':
                  const floatNumber = parseFloat(row[prop]);
                  if (isNaN(floatNumber)) {
                    throw new Error(
                      `Can not parse ${row[prop]} as int at line ${lineNumber}`,
                    );
                  }
                  object[prop] = floatNumber;
                  break;
                default:
                  // string?
                  object[prop] = row[prop];
              }
            } catch (e) {
              // abort transaction and delete the Realm
              realm.cancelTransaction();
              realm.close();
              fsExtra.removeSync(realm.path);
              throw new Error(
                `Parsing error at line ${lineNumber}, expected type "${schema
                  .properties[prop]}" but got "${row[
                  prop
                ]}" for column "${prop}"\nError details: ${e}`,
              );
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

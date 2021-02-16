////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import fs from 'fs-extra';
import papaparse from 'papaparse';
import { ObjectSchemaProperty, PropertyType } from 'realm';
import moment from 'moment';

import { DataImporter, ImportableFile } from '../DataImporter';

export class CSVDataImporter extends DataImporter {
  private static readonly NUMBER_OF_INSERTS_BEFORE_COMMIT = 10000;

  public import(realm: Realm, files: ImportableFile[]) {
    console.log("import called", realm, files);
    for(const file of files) {
      const className = file.className;
      const schema = realm.schema.find(s => s.name === className);
      if (!schema) {
        throw new Error(
          `Unable to import ${file.path}: Class name (${className}) missing from schema`,
        );
      }

      const rawCSV = fs.readFileSync(file.path, 'utf8');
      const data = papaparse.parse<any>(rawCSV, {
        header: true, // to avoid parsing first line as data
        skipEmptyLines: true,
      }).data;

      realm.beginTransaction();
      let numberOfInsert = 0;
      for (const [rowIndex, dataRow] of data.entries()) {
        const object: any = {};
        for (const propName in schema.properties) {
          if (propName in dataRow) {
            // We know that this is a ObjectSchemaProperty since we're reading it from the realm.schema
            const propertySchema = schema.properties[
              propName
            ] as ObjectSchemaProperty;
            const dataValue = dataRow[propName];
            try {
              if (propertySchema.optional && dataValue === '') {
                object[propName] = null;
              } else {
                object[propName] = this.convertToType(
                  dataValue,
                  propertySchema.type,
                );
              }
            } catch (e) {
              // abort transaction and delete the Realm
              realm.cancelTransaction();
              throw new Error(
                `Parsing error at line ${rowIndex}, expected type "${propertySchema.type}" but got "${dataValue}" for column "${propName}"\nError details: ${e}`,
              );
            }
          }
        }

        try {
          realm.create(schema.name, object);
        } catch (e) {
          // This might throw, if the CSV violate the current Realm constraints (ex: nullability or primary key)
          // or generally if the CSV schema is not compatible with the current Realm.
          realm.cancelTransaction();
          throw e;
        }

        numberOfInsert++;

        // commit by batch to avoid creating multiple transactions.
        if (
          numberOfInsert === CSVDataImporter.NUMBER_OF_INSERTS_BEFORE_COMMIT
        ) {
          realm.commitTransaction();
          numberOfInsert = 0;
          realm.beginTransaction();
        }
      }

      realm.commitTransaction();
    };
  }

  private convertToType(value: string, type: PropertyType) {
    switch (type) {
      case 'string':
        return value;
      case 'bool':
        return JSON.parse(value.toLocaleLowerCase());
      case 'int': {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
          throw new Error(`Can not parse "${value}" as integer`);
        }
        return parsed;
      }
      case 'float':
      case 'double': {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
          throw new Error(`Can not parse ${value} as float / double`);
        }
        return parsed;
      }
      case 'date':
        return moment(value).toDate();
      default:
        throw new Error(`Importing data of type "${type}" is not supported`);
    }
  }
}

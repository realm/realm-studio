import fs = require('fs-extra');
import papaparse = require('papaparse');
import * as fsPath from 'path';
import { ImportObjectSchema, ImportSchemaFormat } from '../data-importer';
import Util from './Util';

/**
 * Will analyze the contents of files provided to it, and intelligently 
 * generate a schema definition object with which the structure of a Realm file can be created.
 * 
 * This is then used to map the raw data to the appropriate properties when performing the import to Realm.
 */
export default class ImportSchemaGenerator {
  private files: string[];
  private format: ImportSchemaFormat;

  constructor(format: ImportSchemaFormat, files: string[]) {
    this.format = this.importSchemaFormat(files[0]);
    this.files = files;
  }

  public generate(): Realm.ObjectSchema[] {
    switch (this.format) {
      case ImportSchemaFormat.CSV:
        return this.generateForCSV();
      default:
        throw new Error('Not suported yet');
    }
  }

  private generateForCSV(): Realm.ObjectSchema[] {
    const schemas = Array<Realm.ObjectSchema>();

    this.files.map(file => {
      const schema = new ImportObjectSchema();
      schema.name = fsPath.basename(file, fsPath.extname(file));
      let rawCSV = fs.readFileSync(file, 'utf8');

      // Read header only
      const content = papaparse.parse(rawCSV, {
        header: true,
        preview: 1,
      });
      rawCSV = '';
      const headers: string[] = content.meta.fields;
      const data: any[] = content.data;
      headers.forEach((header, index) => {
        const value: string = data[0][header];
        schema.properties[header] = Util.isBoolean(value)
          ? 'bool?'
          : Util.isInt(value)
            ? 'int?'
            : Util.isDouble(value) ? 'double?' : 'string?';
      });
      schemas.push(schema);
    });
    return schemas;
  }

  private importSchemaFormat(file: string): ImportSchemaFormat {
    switch (fsPath
      .extname(file)
      .toLocaleLowerCase()
      .substr(1)) {
      case ImportSchemaFormat.CSV:
        return ImportSchemaFormat.CSV;
      case ImportSchemaFormat.JSON:
        return ImportSchemaFormat.JSON;
      default:
        throw new Error(`Unsupported file format: ${file}`);
    }
  }
}

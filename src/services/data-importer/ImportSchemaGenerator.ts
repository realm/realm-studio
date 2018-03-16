import fs = require('fs-extra');
import papaparse = require('papaparse');
import * as fsPath from 'path';
import { ImportFormat, ImportObjectSchema } from '../data-importer';
import Util from './Util';

/**
 * Will analyze the contents of files provided to it, and intelligently
 * generate a schema definition object with which the structure of a Realm file can be created.
 *
 * This is then used to map the raw data to the appropriate properties when performing the import to Realm.
 */
export default class ImportSchemaGenerator {
  private files: string[];
  private format: ImportFormat;

  constructor(format: ImportFormat, files: string[]) {
    this.format = format;
    this.files = files;
  }

  public generate(): Realm.ObjectSchema[] {
    switch (this.format) {
      case ImportFormat.CSV:
        return this.generateForCSV();
      default:
        throw new Error('Not supported yet');
    }
  }

  private generateForCSV(): Realm.ObjectSchema[] {
    const schemas = Array<Realm.ObjectSchema>();

    this.files.map(file => {
      const name = fsPath.basename(file, fsPath.extname(file));
      const schema = new ImportObjectSchema(name);
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
}

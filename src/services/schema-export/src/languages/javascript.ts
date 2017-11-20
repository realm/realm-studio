import * as fsPath from 'path';
import { ISchemaFile, SchemaExporter } from '../schemaExporter';

export default class JSSchemaExporter extends SchemaExporter {
  constructor() {
    super();
  }

  public exportSchema(realm: Realm): ISchemaFile[] {
    realm.schema.forEach(schema => {
      this.makeSchema(schema);
    });
    this.addFile(fsPath.parse(realm.path).name + '-model.js', this.content);

    return this.files;
  }

  public makeSchema(schema: Realm.ObjectSchema) {
    this.appendLine(`exports.${schema.name} = {`);
    this.appendLine(`  name: '${schema.name}',`);

    if (schema.primaryKey) {
      this.appendLine(`  primaryKey: '${schema.primaryKey}'`);
    }

    // properties
    this.appendLine(`  properties: {`);
    let i = 1;
    const lastIdx = Object.keys(schema.properties).length;
    let line: string;
    for (const key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        const primaryKey = key === schema.primaryKey;
        line = '    ' + this.propertyLine(schema.properties[key], primaryKey);
        if (i++ < lastIdx) {
          line += ',';
        }
        this.appendLine(line);
      }
    }

    this.appendLine('  }\n}\n');
  }

  public propertyLine(prop: any, primaryKey: boolean): string {
    // Name of the type
    let typeStr = '';
    switch (prop.type) {
      case 'list':
      case 'object':
      case 'linkingObjects':
        typeStr = prop.objectType;
        break;
      default:
        typeStr = prop.type;
    }
    if (prop.optional && prop.type !== 'object') {
      typeStr += '?';
    }
    if (prop.type === 'list') {
      typeStr += '[]';
    }

    // Make line
    let line = prop.name + ': ';
    if (prop.indexed && !primaryKey) {
      line += `{ type: '${typeStr}', indexed: true }`;
    } else {
      line += `'${typeStr}'`;
    }
    return line;
  }
}

import fs = require('fs-extra');
import * as fsPath from 'path';
import * as Realm from 'realm';

export interface ISchemaExporter {
  exportSchema: (realm: Realm) => ISchemaFile[];
  writeFilesToDisk: (path: string) => void;
}

export interface ISchemaFile {
  filename: string;
  content: string;
}

export abstract class SchemaExporter implements ISchemaExporter {
  public realm: Realm;
  public realmName: string;
  public files: ISchemaFile[];
  public content = '';

  constructor() {
    this.content = '';
    this.files = [];
  }

  public appendLine(line: string) {
    this.content += line + '\n';
  }

  public addFile(filename: string, content: string) {
    this.files.push({
      filename,
      content,
    });
  }

  public abstract makeSchema(schema: Realm.ObjectSchema): void;

  public exportSchema(realm: Realm): ISchemaFile[] {
    this.realmName = fsPath.parse(realm.path).name;
    this.realm = realm;

    realm.schema.forEach(schema => {
      this.makeSchema(schema);
    });
    return this.files;
  }

  public writeFilesToDisk(path: string) {
    this.files.forEach(file => {
      const fullpath = fsPath.resolve(path, file.filename);
      fs.outputFileSync(fullpath, file.content);
    });
  }

  protected capitalizedString(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

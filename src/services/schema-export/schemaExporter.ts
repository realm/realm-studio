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

import * as fs from 'fs-extra';
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
  public realm?: Realm;
  public realmName?: string;
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

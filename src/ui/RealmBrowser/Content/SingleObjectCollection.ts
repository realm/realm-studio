////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
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

/**
 * Mock implementation of Realm.Result<T> to wrap a single Realm.Object, to allow
 * using a single Realm.Object in the Table.
 */
export class SingleObjectCollection<T extends Realm.Object> extends Array<T>
  implements Realm.Results<T> {
  public readonly type: Realm.PropertyType;
  public readonly optional = false;

  constructor(object: T) {
    super(object);
    this.type = object.objectSchema().name;
  }

  public toJSON(): any[] {
    return this.toJSON();
  }

  public update() {
    throw new Error('Not implemented');
  }

  public description(): string {
    throw new Error('Not implemented');
  }

  public isValid(): boolean {
    return true;
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }

  public min(property: string): any {
    throw new Error('Not implemented');
  }

  public max(property: string): any {
    throw new Error('Not implemented');
  }

  public sum(property: string): any {
    throw new Error('Not implemented');
  }

  public avg(property: string): any {
    throw new Error('Not implemented');
  }

  public filtered(): Realm.Results<T> {
    return this;
  }

  public sorted(): Realm.Results<T> {
    return this;
  }

  public snapshot(): Realm.Results<T> {
    return this;
  }

  public addListener() {
    throw new Error('Not implemented');
  }

  public removeListener() {
    throw new Error('Not implemented');
  }

  public removeAllListeners() {
    throw new Error('Not implemented');
  }
}

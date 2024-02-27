////////////////////////////////////////////////////////////////////////////
//
// Copyright 2023 Realm Inc.
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
 * Mock implementation of Realm.Result<T> that returns empty results. This is because an asymmetric table
 * cannot be queried and thus we cannot obtain the results wrapping it.
 */
export class MockedObjectCollection<T extends Realm.Object>
  extends Array<T>
  implements Realm.Results<T>
{
  public readonly type: Realm.PropertyType | string;
  public readonly optional = false;

  constructor(schema: Realm.ObjectSchema) {
    super();
    this.type = schema.name;
  }

  public toJSON(): any[] {
    return this.toJSON();
  }

  public update(): void {
    throw new Error('Not implemented');
  }

  public description(): string {
    throw new Error('Not implemented');
  }

  public isValid(): boolean {
    return true;
  }

  public isEmpty(): boolean {
    return true;
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

  public *keys() {
    throw new Error('Not implemented');
  }

  public *values() {
    throw new Error('Not implemented');
  }

  public *entries() {
    throw new Error('Not implemented');
  }

  public addListener(): void {
    throw new Error('Not implemented');
  }

  public removeListener(): void {
    throw new Error('Not implemented');
  }

  public removeAllListeners(): void {
    throw new Error('Not implemented');
  }

  public subscribe(): Promise<this> {
    throw new Error('Method not implemented.');
  }

  public unsubscribe(): void {
    throw new Error('Method not implemented.');
  }
}

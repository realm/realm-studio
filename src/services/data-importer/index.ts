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

import * as csv from './csv';
export { csv };

export * from './ui';

export enum ImportFormat {
  CSV = 'csv',
  // JSON = 'json',
}

export const generateSchema = (format: ImportFormat, paths: string[]) => {
  if (format === ImportFormat.CSV) {
    const generator = new csv.CSVSchemaGenerator(paths);
    return generator.generate();
  } else {
    throw new Error('Not supported yet');
  }
};

export const getDataImporter = (
  format: ImportFormat,
) => {
  if (format === ImportFormat.CSV) {
    return new csv.CSVDataImporter();
  } else {
    throw new Error('Not supported yet');
  }
};

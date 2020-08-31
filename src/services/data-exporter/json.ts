////////////////////////////////////////////////////////////////////////////
//
// Copyright 2019 Realm Inc.
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
import Realm from 'realm';

import { IExportEngine } from '.';

const INDENTATION_SPACES = 2;

type ResultMap = {
  [key: string]: Realm.Results<Realm.Object>;
};

const serialize = (map: ResultMap) => {
  try {
    return JSON.stringify(map, null, INDENTATION_SPACES);
  } catch (err) {
    if (
      err instanceof TypeError &&
      err.message.startsWith('Converting circular structure to JSON')
    ) {
      return JSON.stringify(
        map,
        Realm.JsonSerializationReplacer,
        INDENTATION_SPACES,
      );
    }
    throw err;
  }
};

export class JSONExportEngine implements IExportEngine {
  public export(realm: Realm, destinationPath: string) {
    const resultMap: ResultMap = realm.schema.reduce(
      (map: ResultMap, objectSchema) => {
        if (!objectSchema.embedded) {
          map[objectSchema.name] = realm.objects(objectSchema.name).snapshot();
        }
        return map;
      },
      {},
    );

    // Write the stringified data to a file
    fs.writeFileSync(destinationPath, serialize(resultMap));
  }
}

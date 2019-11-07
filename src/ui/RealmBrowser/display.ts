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

import util from 'util';

export const displayObject = (
  object: Realm.Object | null,
  inspectOnMissingPk = false,
) => {
  if (object) {
    const schema = object.objectSchema();
    if (schema.primaryKey) {
      const pk = (object as { [property: string]: any })[schema.primaryKey];
      return `${schema.name} {${schema.primaryKey} = ${pk}}`;
    } else if (inspectOnMissingPk) {
      return util.inspect(object, false, 0).replace('RealmObject', schema.name);
    } else {
      return schema.name;
    }
  } else {
    return 'null';
  }
};

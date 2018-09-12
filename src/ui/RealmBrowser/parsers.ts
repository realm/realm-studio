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

import * as moment from 'moment';

export const parseNumber = (
  value: string,
  property: Realm.ObjectSchemaProperty,
) => {
  if (value === '' && property.optional) {
    return null;
  } else {
    const parsedValue =
      property.type === 'int' ? parseInt(value, 10) : parseFloat(value);
    if (isNaN(parsedValue)) {
      throw new Error(`"${value}" is not a proper ${property.type}`);
    } else {
      return parsedValue;
    }
  }
};

export const parseBoolean = (
  value: string,
  property: Realm.ObjectSchemaProperty,
) => {
  const normalizedValue = value
    .toString()
    .trim()
    .toLowerCase();

  if (normalizedValue === '' && property.optional) {
    return null;
  } else {
    switch (normalizedValue) {
      case 'true':
      case '1':
        return true;
      case 'false':
      case '0':
        return false;
      default:
        throw new Error(
          `"${value}" is not a boolean:\nUse "true", "false", "0" or "1"`,
        );
    }
  }
};

export const parseDate = (
  value: string,
  property: Realm.ObjectSchemaProperty,
) => {
  if (value === '' && property.optional) {
    return null;
  } else {
    const parsed = moment(value);
    if (parsed.isValid()) {
      return parsed.toDate();
    } else {
      throw new Error(`"${value}" is not a date: Use the ISO format`);
    }
  }
};

/**
 * Parses a string representation entered by the user into a native representation of a field which can be saved to
 * the Realm.
 */
export const parse = (value: string, property: Realm.ObjectSchemaProperty) => {
  // For every type
  switch (property.type) {
    case 'int':
    case 'float':
    case 'double': {
      return parseNumber(value, property);
    }
    case 'bool': {
      return parseBoolean(value, property);
    }
    case 'date':
      return parseDate(value, property);
    case 'string':
      return value;
    default:
      throw new Error(`Unexpected property type: ${property.type}`);
  }
};

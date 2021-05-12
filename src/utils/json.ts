// Regex to clean up added $refId & $ref properties, added by Realm.JsonSerializationReplacer

import { display as displayDataCell } from '../ui/RealmBrowser/Content/Table/types/DataCell';

// TODO: Investigate better solution.
const $REF_MATCHER = /\s*\"\$ref[Id]*\" *: *(\"(.*?)\"(,|\s|)|\s*\{(.*?)\}(,|\s|))/g;

const DEFAULT_POSTFIX = ' (...)';
const INDENTATION = 2;

type SafeJsonOptions = {
  pretty?: boolean;
  cleanupRefs?: boolean;
  maxLength?: number;
  postFix?: string;
};

export const asSafeJsonString = (
  value: unknown,
  options?: SafeJsonOptions,
): string => {
  let json: string;
  const indentation = options?.pretty ? INDENTATION : undefined;

  try {
    json = JSON.stringify(value, null, indentation);
  } catch {
    try {
      json = JSON.stringify(
        value,
        Realm.JsonSerializationReplacer,
        indentation,
      );
    } catch (err) {
      json = err.message ? err.message : err;
    }
  }

  if (!json) {
    return 'null';
  }

  if (options) {
    if (options.cleanupRefs) {
      json = json.replace($REF_MATCHER, '');
    }

    if (options.maxLength && json.length > options.maxLength) {
      json =
        json.slice(0, options.maxLength) + (options.postFix ?? DEFAULT_POSTFIX);
    }
  }

  return json;
};

/**
 * Utility function to indicate if the JsonViewerDialog should be utilized for a cell
 */
export const useJsonViewer = (
  property: Realm.ObjectSchemaProperty,
  value: any,
): boolean => {
  if (property.type === 'dictionary' || property.type === 'set') {
    return true;
  }

  if (property.type === 'list' && property.objectType === 'mixed') {
    return true;
  }

  if (
    property.type === 'mixed' &&
    (value instanceof Realm.Object ||
      // eslint-disable-next-line
      // @ts-ignore The way we expose Realm.Collection does not work for instanceof...
      value instanceof Realm.Collection ||
      (value !== null && typeof value === 'object' && !(value instanceof Date)))
  ) {
    return true;
  }

  return false;
};

const VALUE_STRING_LENGTH_LIMIT = 50;

export const getCellStringRepresentation = (
  property: Realm.ObjectSchemaProperty,
  value: any,
): string => {
  if (value === null || typeof value === 'undefined') {
    return 'null';
  }

  if (value.objectSchema) {
    const { primaryKey, name } = value.objectSchema();
    // prefix with the the Class type, if in mixed context
    const prefix = property.objectType === 'mixed' ? `${name}#` : '';
    return primaryKey
      ? prefix + value[primaryKey]
      : asSafeJsonString(value, {
          cleanupRefs: true,
          maxLength: VALUE_STRING_LENGTH_LIMIT,
        });
  }

  if (useJsonViewer(property, value)) {
    return asSafeJsonString(value, {
      cleanupRefs: true,
      maxLength: VALUE_STRING_LENGTH_LIMIT,
    });
  }

  if (property.objectType === 'data') {
    return displayDataCell(value);
  }

  return typeof value === 'string' ? `"${value}"` : String(value);
};

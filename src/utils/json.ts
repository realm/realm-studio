// Regex to clean up added $refId & $ref properties, added by Realm.JsonSerializationReplacer
// TODO: Investigate better solution.
const $REF_MATCHER = /\s*\"\$ref[Id]*\" *: *\".*\"(,|(?=\s+\}))/;

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

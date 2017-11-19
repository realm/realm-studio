import * as moment from 'moment';

export const parseNumber = (
  value: string,
  property: Realm.ObjectSchemaProperty,
) => {
  const parsedValue =
    property.type === 'int' ? parseInt(value, 10) : parseFloat(value);
  if (isNaN(parsedValue)) {
    throw new Error(`"${value}" is not a proper ${property.type}`);
  } else {
    return parsedValue;
  }
};

export const parseBoolean = (value: string) => {
  const normalizedValue = value
    .toString()
    .trim()
    .toLowerCase();

  switch (normalizedValue) {
    case 'true':
    case '1':
      return true;
    case 'false':
    case '0':
      return false;
    default:
      throw new Error(
        `"${value}" is not a boolean: Use "true", "false", "0" or "1"`,
      );
  }
};

export const parseDate = (value: string) => {
  const parsed = moment(value);
  if (parsed.isValid()) {
    return parsed.toDate();
  } else {
    throw new Error(`"${value}" is not a date: Use the ISO format`);
  }
};

export const parse = (value: string, property: Realm.ObjectSchemaProperty) => {
  // If optional
  if (property.optional && value === '') {
    throw new Error('This field is not optional');
  }
  // For every type
  switch (property.type) {
    case 'int':
    case 'float':
    case 'double': {
      return parseNumber(value, property);
    }
    case 'bool': {
      return parseBoolean(value);
    }
    case 'date':
      return parseDate(value);
    case 'string':
      return value;
    default:
      throw new Error(`Unexpected property type: ${property.type}`);
  }
};

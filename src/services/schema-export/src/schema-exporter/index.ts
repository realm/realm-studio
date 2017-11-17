import {
  AbstractSchemaExporter,
  ISchemaExporter,
} from './abstractSchemaExporter';
import JSSchemaExporter from './languages/javascript';
import SwiftSchemaExporter from './languages/swift';

export enum Language {
  ObjC = 'objC',
  Swift = 'swift',
  Java = 'java',
  CS = 'CS',
  JS = 'JS',
}

export const SchemaExporter = (language: Language): ISchemaExporter => {
  switch (language) {
    case Language.Swift:
      return new SwiftSchemaExporter();
    case Language.JS:
      return new JSSchemaExporter();
    default:
      return new AbstractSchemaExporter();
  }
};

import JSSchemaExporter from './languages/javascript';
import SwiftSchemaExporter from './languages/swift';
import { ISchemaExporter } from './schemaExporter';

export enum Language {
  ObjC = 'objC',
  Swift = 'swift',
  Java = 'java',
  CS = 'C#',
  JS = 'JS',
}

export const SchemaExporter = (language: Language): ISchemaExporter => {
  switch (language) {
    case Language.Swift:
      return new SwiftSchemaExporter();
    case Language.JS:
      return new JSSchemaExporter();
    default:
      throw new Error('Language not supported');
  }
};

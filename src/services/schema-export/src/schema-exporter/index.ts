import JSSchemaExporter from './languages/javascript';
import SwiftSchemaExporter from './languages/swift';
import JavaSchemaExporter from './languages/java'

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
    case Language.Java:
      return new JavaSchemaExporter();  
    default:
      throw new Error('Language not supported');
  }
};

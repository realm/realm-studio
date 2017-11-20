import * as fsPath from 'path';
import { ISchemaFile, SchemaExporter } from '../schemaExporter';

export default class JavaSchemaExporter extends SchemaExporter {
  private static readonly PADDING = '    ';

  private fieldsContent = '';
  private gettersContent = '';
  private settersContent = '';

  constructor() {
    super();
    this.fieldsContent = '';
    this.gettersContent = '';
    this.settersContent = '';
  }

  public exportSchema(realm: Realm): ISchemaFile[] {
    realm.schema.forEach(schema => {
      this.makeSchema(schema);
    });

    return this.files;
  }

  public makeSchema(schema: Realm.ObjectSchema) {
    this.appendLine("// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models");
    this.appendLine('package your.package.name.here;');
    this.appendLine('');

    const realmImports = new Set<string>();
    realmImports.add('import io.realm.RealmObject;');

    this.fieldsContent += `public class ${schema.name} extends RealmObject {\n\n`;

    // Properties
    for (const key in schema.properties) {
      if (schema.properties.hasOwnProperty(key)) {
        const prop: any = schema.properties[key];
        this.propertyLine(prop, schema.primaryKey);
        if (prop.indexed && prop.name !== schema.primaryKey) {
          realmImports.add('import io.realm.annotations.Index;');
        }

        if (!prop.optional && this.javaPropertyTypeCanBeMarkedRequired(prop.type)) {
          realmImports.add('import io.realm.annotations.Required;');
        }
      }
    }

    // Primary key
    if (schema.primaryKey) {
      realmImports.add('import io.realm.annotations.PrimaryKey;');
    }

    // Add all Realm imports 
    for (let realmImport of realmImports) {
      this.appendLine(realmImport);
    }
    this.appendLine('');

    // Add class body
    this.appendLine(this.fieldsContent);

    // Add getters and setters
    this.appendLine(this.gettersContent);
    this.appendLine(this.settersContent);

    // End class
    this.appendLine('}');
    this.appendLine('');

    this.addFile(schema.name + '.java', this.content);

    // reset content for next Schema
    this.content = '';
    this.fieldsContent = '';
    this.gettersContent = '';
    this.settersContent = '';
  }

  private propertyLine(prop: any, primaryKey: string | undefined): void {
    if (prop.name == primaryKey) {
      this.fieldsContent += `${JavaSchemaExporter.PADDING}@PrimaryKey\n`;
    } else if (prop.indexed) {
      this.fieldsContent += `${JavaSchemaExporter.PADDING}@Index\n`;
    }
    if (!prop.optional && this.javaPropertyTypeCanBeMarkedRequired(prop.type)) {
      this.fieldsContent += `${JavaSchemaExporter.PADDING}@Required\n`;
    }

    this.fieldsContent += `${JavaSchemaExporter.PADDING}private ${this.javaNameForProperty(prop)} ${prop.name};\n`;

    this.gettersContent += `${JavaSchemaExporter.PADDING}public ${this.javaNameForProperty(prop)} ${(prop.type == 'bool') ? 'is' : 'get'}${this.capitalizedString(prop.name)}() {
  ${JavaSchemaExporter.PADDING}return ${prop.name};
    }\n`;

    this.settersContent += `${JavaSchemaExporter.PADDING}public void set${this.capitalizedString(prop.name)}(${this.javaNameForProperty(prop)} ${prop.name}) {
  ${JavaSchemaExporter.PADDING}${JavaSchemaExporter.PADDING}this.${prop.name} = ${prop.name};
    }\n`;
  }

  private javaPropertyTypeCanBeMarkedRequired(type: any): boolean {
    switch (type) {
      case 'bool':
      case 'int':
      case 'float':
      case 'double':
      case 'object':
        return false;
      case 'string':
      case 'data':
      case 'date':
      case 'linkingObjects':
        return true;
    }
    return false;
  }

  private javaNameForProperty(property: any): any {
    if (property.type === 'list') {
      switch (property.objectType) {
        case 'bool':
          return "RealmList<Boolean>";
        case 'int':
          return "RealmList<Long>";
        case 'float':
          return "RealmList<Float>";
        case 'double':
          return "RealmList<Double>";
        case 'string':
          return "RealmList<String>";
        case 'data':
          return "RealmList<byte[]>";
        case 'date':
          return "RealmList<java.util.Date>";
        default:
          return `RealmList<${property.objectType}>`;
      }
    }
    switch (property.type) {
      case 'bool':
        return property.optional ? "Boolean" : "boolean";
      case 'int':
        return property.optional ? "Long" : "long";
      case 'float':
        return property.optional ? "Float" : "float";
      case 'double':
        return property.optional ? "Double" : "double";
      case 'string':
        return "String";
      case 'data':
        return "byte[]";
      case 'date':
        return "java.util.Date";
      case 'object':
        return property.objectType;
      case 'linkingObjects':
        return "RealmList";
    }

    return null;
  }

  private capitalizedString(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

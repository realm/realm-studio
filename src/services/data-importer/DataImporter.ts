import * as Realm from 'realm';

export abstract class DataImporter {
  protected files: string[];
  protected importSchema: Realm.ObjectSchema[];
  /**
   * Creates a new instance of `DataImporter`, taking one or more files that will be
   * converted into a Realm file.
   *
   * @param files absolute paths to the file(s) to import.
   * @param importSchema The import schema with which this file will be created.
   */

  constructor(files: string[], importSchema: Realm.ObjectSchema[]) {
    this.files = files;
    this.importSchema = importSchema;
  }

  /**
   * Creates a new, empty Realm file, formatted with the schema properties provided
   * with the `ImportSchema` parameter.
   *
   * @param output An absolute path to the folder that will hold the new Realm file.
   */
  public createNewRealmFile(output: string): Realm {
    const realm = new Realm({
      path: `${output}/default.realm`,
      schema: this.importSchema,
    });
    return realm;
  }

  /**
   * An abstract method, overidden in subclasses that performs the data import.
   *
   * @param path Absolute path to the directory where the Realm file will be generated.
   * @param importSchema The import schema with which this file will be created.
   */
  public abstract import(
    path: string,
    importSchema: Realm.ObjectSchema[],
  ): Realm;
}

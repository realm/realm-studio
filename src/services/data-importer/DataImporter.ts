import * as Realm from 'realm';

export abstract class DataImporter {
  protected files: string[];
  /**
   * Creates a new instance of `DataImporter`, taking one or more files that will be 
   * converted into a Realm file.
   * 
   * @param files absolute paths to the file(s) to import. 
   */

  constructor(files: string[]) {
    this.files = files;
  }

  /**
   * Creates a new, empty Realm file, formatted with the schema properties provided
   * with the `ImportSchema` parameter.
   * 
   * @param output An absolute path to the folder that will hold the new Realm file.
   * @param importSchema The import schema with which this file will be created.
   */
  public createNewRealmFile(
    output: string,
    importSchema: Realm.ObjectSchema[],
  ): Realm {
    const realm = new Realm({
      path: `${output}/default.realm`,
      schema: importSchema,
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

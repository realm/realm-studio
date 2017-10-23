import { IClassFocus } from './focus';

// TODO: Remove this interface once the Realm.ObjectSchemaProperty
// has a name parameter in its type definition.
export interface IPropertyWithName extends Realm.ObjectSchemaProperty {
  name: string | null;
  readOnly: boolean;
}

export interface ISelectObjectState {
  focus: IClassFocus;
  property: IPropertyWithName;
  object: Realm.Object;
}

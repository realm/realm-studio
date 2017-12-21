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
  object: Realm.Object | Realm.List<any>;
}

export enum EditMode {
  Disabled = 'disabled',
  InputBlur = 'input-blur',
  KeyPress = 'key-press',
}

export type CreateObjectHandler = (className: string, values: {}) => void;
export type EditModeChangeHandler = (editMode: EditMode) => void;

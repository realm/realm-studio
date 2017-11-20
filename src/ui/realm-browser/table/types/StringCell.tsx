import * as classnames from 'classnames';
import * as React from 'react';
import { Input } from 'reactstrap';

export const StringCell = ({
  isEditing,
  onChange,
  onBlur,
  onFocus,
  value,
  property,
}: {
  isEditing: boolean;
  onChange: (newValue: string) => void;
  onBlur: (input: HTMLInputElement) => void;
  property: Realm.ObjectSchemaProperty;
  onFocus: () => void;
  value: string;
}) => {
  let textInput: HTMLInputElement;
  return isEditing ? (
    <Input
      className={classnames(
        'RealmBrowser__Table__Input',
        `RealmBrowser__Table__Input--${property.type}`,
      )}
      size="sm"
      getRef={input => {
        textInput = input;
      }}
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={e => onBlur(textInput)}
      onKeyPress={e => e.key === 'Enter' && onBlur(textInput)}
      autoFocus={true}
    />
  ) : (
    <div
      className={classnames(
        'form-control',
        'form-control-sm',
        'RealmBrowser__Table__Input',
        'RealmBrowser__Table__Input--unselectable',
        `RealmBrowser__Table__Input--${property.type}`,
        { 'RealmBrowser__Table__Input--null': value === null },
      )}
      onDoubleClick={onFocus}
    >
      {value === null ? 'null' : value.toString()}
    </div>
  );
};

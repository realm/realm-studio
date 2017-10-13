import * as classnames from 'classnames';
import * as React from 'react';
import { Input } from 'reactstrap';

export const StringCell = ({
  isEditing,
  onChange,
  onBlur,
  onFocus,
  value,
  temporalValue,
  property,
}: {
  isEditing: boolean;
  onChange: (newValue: string) => void;
  onBlur: (input: HTMLInputElement) => void;
  property: Realm.ObjectSchemaProperty;
  onFocus: () => void;
  value: string;
  temporalValue: string;
}) => {
  let textInput: HTMLInputElement;
  return isEditing ? (
    <Input
      className={classnames(
        'RealmBrowser__Content__Input',
        `RealmBrowser__Content__Input--${property.type}`,
      )}
      size="sm"
      getRef={input => {
        textInput = input;
      }}
      value={temporalValue}
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
        'RealmBrowser__Content__Input',
        'RealmBrowser__Content__Input--unselectable',
        `RealmBrowser__Content__Input--${property.type}`,
        { 'RealmBrowser__Content__Input--null': value === null },
      )}
      onDoubleClick={onFocus}
    >
      {value === null ? 'null' : value.toString()}
    </div>
  );
};

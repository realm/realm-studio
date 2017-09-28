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
  onContextMenu,
}: {
  isEditing: boolean;
  onChange: (newValue: string) => void;
  onBlur: (input: HTMLInputElement) => void;
  onFocus: () => void;
  value: string;
  temporalValue: string;
  onContextMenu: (e: React.SyntheticEvent<any>) => void;
}) => {
  let textInput: HTMLInputElement;
  return isEditing ? (
    <Input
      className="RealmBrowser__Content__Input"
      size="sm"
      getRef={input => {
        textInput = input;
      }}
      value={temporalValue}
      onChange={e => onChange(e.target.value)}
      onBlur={e => onBlur(textInput)}
      onKeyPress={e => e.key === 'Enter' && onBlur(textInput)}
      onContextMenu={onContextMenu}
    />
  ) : (
    <div
      className={classnames(
        'form-control',
        'form-control-sm',
        'RealmBrowser__Content__Input',
        { 'RealmBrowser__Content__Input--null': value === null },
      )}
      onClick={onFocus}
      onContextMenu={onContextMenu}
    >
      {value === null ? 'null' : value.toString()}
    </div>
  );
};

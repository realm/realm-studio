import * as classnames from 'classnames';
import * as React from 'react';
import { Input } from 'reactstrap';

export const StringCell = ({
  isEditing,
  onChange,
  isHighlighted,
  onBlur,
  onFocus,
  value,
  property,
}: {
  isEditing: boolean;
  onChange: (value: string, input: HTMLInputElement) => void;
  isHighlighted: boolean;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
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
      onChange={e => onChange(e.target.value, e.target)}
      onBlur={e => onBlur(e)}
      onKeyPress={e => e.key === 'Enter' && e.currentTarget.blur()}
      autoFocus={true}
    />
  ) : (
    <div
      className={classnames(
        'form-control',
        'form-control-sm',
        'RealmBrowser__Table__Input',
        `RealmBrowser__Table__Input--${property.type}`,
      )}
      onDoubleClick={onFocus}
    >
      <span
        className={classnames(
          'RealmBrowser__Table__StringCell',
          `RealmBrowser__Table__StringCell--${property.type}`,
          {
            'RealmBrowser__Table__StringCell--null': value === null,
          },
        )}
      >
        {value === null ? 'null' : value.toString()}
      </span>
    </div>
  );
};

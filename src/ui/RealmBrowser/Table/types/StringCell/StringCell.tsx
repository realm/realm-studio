import * as classnames from 'classnames';
import * as React from 'react';
import { Input } from 'reactstrap';

export const StringCell = ({
  getRef,
  isEditing,
  isHighlighted,
  onBlur,
  onChange,
  onClick,
  property,
  value,
}: {
  getRef: (instance: HTMLInputElement) => any;
  isEditing: boolean;
  isHighlighted: boolean;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  onClick: (e: React.MouseEvent<any>) => void;
  property: Realm.ObjectSchemaProperty;
  value: string;
}) => {
  return isEditing ? (
    <Input
      contentEditable={isEditing}
      className={classnames(
        'RealmBrowser__Table__Input',
        `RealmBrowser__Table__Input--${property.type}`,
      )}
      getRef={getRef}
      onBlur={onBlur}
      onClick={onClick}
      onChange={e => onChange(e.target.value)}
      onKeyPress={e => e.key === 'Enter' && e.currentTarget.blur()}
      size="sm"
      value={value}
    />
  ) : (
    <div
      className={classnames(
        'form-control',
        'form-control-sm',
        'RealmBrowser__Table__Input',
        `RealmBrowser__Table__Input--${property.type}`,
      )}
      onDoubleClick={onClick}
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

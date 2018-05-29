import * as classNames from 'classnames';
import * as React from 'react';
import { Button, InputGroup, InputGroupAddon } from 'reactstrap';

import { displayObject } from '../../../display';
import { IClassFocus } from '../../../focus';
import { ObjectSelector } from '../../../ObjectSelector';

export interface IObjectControlProps {
  children?: React.ReactNode;
  focus?: IClassFocus;
  isObjectSelectorOpen: boolean;
  property: Realm.ObjectSchemaProperty;
  toggleObjectSelector: () => void;
  updateObjectReference: (object: Realm.Object | null) => void;
  value: any;
}

export const ObjectControl = ({
  children,
  focus,
  isObjectSelectorOpen,
  property,
  toggleObjectSelector,
  updateObjectReference,
  value,
}: IObjectControlProps) => (
  <section className="CreateObjectDialog__ObjectControl">
    <InputGroup>
      <div
        onClick={toggleObjectSelector}
        className="CreateObjectDialog__ObjectControl__FormControl form-control"
      >
        <span
          className={classNames('CreateObjectDialog__ObjectControl__Display', {
            'CreateObjectDialog__ObjectControl__Display--null': value === null,
          })}
        >
          {displayObject(value)}
        </span>
      </div>
      {value !== null && property.optional ? (
        <InputGroupAddon addonType="append">
          <Button size="sm" onClick={() => updateObjectReference(null)}>
            <i className="fa fa-close" />
          </Button>
        </InputGroupAddon>
      ) : null}
      {children}
    </InputGroup>

    {focus ? (
      <ObjectSelector
        focus={focus}
        isOpen={isObjectSelectorOpen}
        isOptional={property.optional}
        onObjectSelected={updateObjectReference}
        toggle={toggleObjectSelector}
      />
    ) : null}
  </section>
);

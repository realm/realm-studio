////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import classNames from 'classnames';
import React from 'react';
import { Button, InputGroup } from 'reactstrap';

import { displayObject } from '../../../../display';
import { SelectObjectDialog } from '../../../SelectObjectDialog';

import { ISelectObjectDialog } from '.';

export interface IObjectControlProps {
  children?: React.ReactNode;
  onShowSelectObjectDialog: () => void;
  property: Realm.ObjectSchemaProperty;
  selectObjectDialog: ISelectObjectDialog;
  updateObjectReference: (object: Realm.Object | null) => void;
  value: any;
}

export const ObjectControl = ({
  children,
  onShowSelectObjectDialog,
  property,
  selectObjectDialog,
  updateObjectReference,
  value,
}: IObjectControlProps) => (
  <section className="CreateObjectDialog__ObjectControl">
    <InputGroup>
      <div
        onClick={onShowSelectObjectDialog}
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
        <Button size="sm" onClick={() => updateObjectReference(null)}>
          <i className="fa fa-close" />
        </Button>
      ) : null}
      {children}
    </InputGroup>

    <SelectObjectDialog {...selectObjectDialog} />
  </section>
);

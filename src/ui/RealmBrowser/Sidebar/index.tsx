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

import * as classNames from 'classnames';
import * as React from 'react';
import { Badge, Button } from 'reactstrap';

import { ClassFocussedHandler } from '..';
import { ILoadingProgress } from '../../reusable/LoadingOverlay';
import { Focus, IListFocus } from '../focus';

import { ListFocus } from './ListFocus';

import './Sidebar.scss';

export const isSelected = (focus: Focus | null, schemaName: string) => {
  if (focus && focus.kind === 'class') {
    return focus.className === schemaName;
  } else if (focus && focus.kind === 'list') {
    return focus.parent.objectSchema().name === schemaName;
  } else {
    return false;
  }
};

export interface ISidebarProps {
  className?: string;
  focus: Focus | null;
  getSchemaLength: (className: string) => number;
  onClassFocussed: ClassFocussedHandler;
  progress: ILoadingProgress;
  schemas: Realm.ObjectSchema[];
  toggleAddSchema: () => void;
}

export const Sidebar = ({
  className,
  focus,
  getSchemaLength,
  onClassFocussed,
  progress,
  schemas,
  toggleAddSchema,
}: ISidebarProps) => (
  <div className={classNames('Sidebar', className)}>
    <div className="Sidebar__Header">
      <span>Classes</span>
      <Button size="sm" onClick={toggleAddSchema}>
        <i className="fa fa-plus" />
      </Button>
    </div>
    {schemas && schemas.length > 0 ? (
      <ul className="Sidebar__SchemaList">
        {schemas.map(schema => {
          const selected = isSelected(focus, schema.name);
          const schemaClass = classNames('Sidebar__Schema__Info', {
            'Sidebar__Schema__Info--selected': selected,
          });
          return (
            <li
              key={schema.name}
              className="Sidebar__Schema"
              title={schema.name}
            >
              <div
                className={schemaClass}
                onClick={() => onClassFocussed(schema.name)}
              >
                <span className="Sidebar__Schema__Name">{schema.name}</span>
                <Badge color="primary">{getSchemaLength(schema.name)}</Badge>
              </div>
              {selected && focus && focus.kind === 'list' ? (
                <ListFocus
                  focus={focus as IListFocus}
                  onClassFocussed={onClassFocussed}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    ) : progress.status === 'done' ? (
      <div className="Sidebar__SchemaList--empty" />
    ) : null}
  </div>
);

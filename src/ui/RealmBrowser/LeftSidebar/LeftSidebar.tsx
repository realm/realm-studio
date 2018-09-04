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
import { ILoadingProgress, Sidebar } from '../../reusable';
import { Focus, IListFocus } from '../focus';

import { ListFocus } from './ListFocus';

import './LeftSidebar.scss';

export const isSelected = (focus: Focus | null, schemaName: string) => {
  if (focus && focus.kind === 'class') {
    return focus.className === schemaName;
  } else if (focus && focus.kind === 'list') {
    return focus.parent.objectSchema().name === schemaName;
  } else {
    return false;
  }
};

export interface ILeftSidebarProps {
  classes: Realm.ObjectSchema[];
  className?: string;
  focus: Focus | null;
  getSchemaLength: (className: string) => number;
  hiddenClassCount: number;
  isOpen: boolean;
  onClassFocussed: ClassFocussedHandler;
  onToggle: () => void;
  progress: ILoadingProgress;
  toggleAddClass: () => void;
}

export const LeftSidebar = ({
  classes,
  className,
  focus,
  getSchemaLength,
  hiddenClassCount,
  isOpen,
  onClassFocussed,
  onToggle,
  progress,
  toggleAddClass,
}: ILeftSidebarProps) => (
  <Sidebar
    className={className}
    contentClassName="LeftSidebar"
    isOpen={isOpen}
    onToggle={onToggle}
    position="left"
    minimumWidth={120}
  >
    <div className="LeftSidebar__Header">
      <span>Classes</span>
      <Button size="sm" onClick={toggleAddClass}>
        <i className="fa fa-plus" />
      </Button>
    </div>
    <div className="LeftSidebar__Classes">
      {classes && classes.length > 0 ? (
        <ul className="LeftSidebar__ClassList">
          {classes.map(schema => {
            const selected = isSelected(focus, schema.name);
            const schemaClass = classNames('LeftSidebar__Class__Info', {
              'LeftSidebar__Class__Info--selected': selected,
            });
            return (
              <li
                key={schema.name}
                className="LeftSidebar__Class"
                title={schema.name}
              >
                <div
                  className={schemaClass}
                  onClick={() => onClassFocussed(schema.name)}
                >
                  <span className="LeftSidebar__Class__Name">
                    {schema.name}
                  </span>
                  <Badge color="secondary">
                    {getSchemaLength(schema.name)}
                  </Badge>
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
        <div className="LeftSidebar__ClassList--empty" />
      ) : null}
      {hiddenClassCount > 0 ? (
        <p className="LeftSidebar__HiddenClassesHint">
          Hiding {hiddenClassCount} system classes
        </p>
      ) : null}
    </div>
  </Sidebar>
);

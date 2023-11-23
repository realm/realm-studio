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
import { Badge, Button } from 'reactstrap';

import { ClassFocussedHandler } from '..';
import { ILoadingProgress, Sidebar } from '../../reusable';
import { Focus, IListFocus } from '../focus';

import { ListFocus } from './ListFocus';
import { SubscriptionList } from './SubscriptionList';

import './LeftSidebar.scss';

export function getFocusedSchemaName(focus: Focus | null): string | undefined {
  if (focus && focus.kind === 'class') {
    return focus.className;
  } else if (focus && focus.kind === 'list') {
    return focus.parent.objectSchema().name;
  } else {
    return undefined;
  }
}

export function isSelected(focus: Focus | null, schemaName: string) {
  return getFocusedSchemaName(focus) === schemaName;
}

export interface ILeftSidebarProps {
  classes: Realm.ObjectSchema[];
  className?: string;
  focus: Focus | null;
  getSchemaLength: (className: string) => number;
  hiddenClassCount: number;
  isOpen: boolean;
  onClassFocussed: ClassFocussedHandler;
  onSubscriptionRemoved: (subscription: Realm.App.Sync.Subscription) => void;
  onToggle: () => void;
  progress: ILoadingProgress;
  readOnly: boolean;
  subscriptions: Realm.App.Sync.SubscriptionSet | undefined;
  toggleAddClass: () => void;
  toggleAddSubscription: () => void;
}

export const LeftSidebar = ({
  classes,
  className,
  focus,
  getSchemaLength,
  hiddenClassCount,
  isOpen,
  onClassFocussed,
  onSubscriptionRemoved,
  onToggle,
  progress,
  readOnly,
  subscriptions,
  toggleAddClass,
  toggleAddSubscription,
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
      {readOnly ? null : (
        <Button size="sm" onClick={toggleAddClass}>
          <i className="fa fa-plus" />
        </Button>
      )}
    </div>
    <div className="LeftSidebar__Classes">
      {classes && classes.length > 0 ? (
        <ul className="LeftSidebar__ClassList">
          {classes.map(schema => {
            const selected = isSelected(focus, schema.name);
            const highlighted = selected && focus && focus.kind === 'class';
            const schemaClass = classNames('LeftSidebar__Class__Info', {
              'LeftSidebar__Class__Info--selected': selected,
              'LeftSidebar__Class__Info--highlighted': highlighted,
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
                  {schema.embedded ? (
                    <Badge
                      color={highlighted ? 'primary' : 'secondary'}
                      title="Embedded class"
                    >
                      E
                    </Badge>
                  ) : (
                    <Badge color={highlighted ? 'primary' : 'secondary'}>
                      {getSchemaLength(schema.name)}
                    </Badge>
                  )}
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
      {readOnly ? (
        <p className="LeftSidebar__ReadOnlyHint">Opened as "Read Only"</p>
      ) : null}
    </div>
    {(focus?.kind === 'class' || focus?.kind === 'list') && subscriptions && (
      <>
        <div className="LeftSidebar__Header">
          <span>subscriptions</span>
          <Button size="sm" onClick={toggleAddSubscription}>
            <i className="fa fa-plus" />
          </Button>
        </div>
        <SubscriptionList
          subscriptions={[...subscriptions].filter(
            sub => sub.objectType === getFocusedSchemaName(focus),
          )}
          onSubscriptionRemoved={onSubscriptionRemoved}
        />
      </>
    )}
  </Sidebar>
);

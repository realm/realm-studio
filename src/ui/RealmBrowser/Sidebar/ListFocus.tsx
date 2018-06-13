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
import { Badge } from 'reactstrap';

import { ClassFocussedHandler } from '..';
import { displayObject } from '../display';
import { IListFocus } from '../focus';

interface IListFocusProps {
  focus: IListFocus;
  onClassFocussed: ClassFocussedHandler;
}

export const ListFocus = ({ focus, onClassFocussed }: IListFocusProps) => {
  return (
    <div className={classNames('Sidebar__List')}>
      <div className="Sidebar__List__Name">
        <span className="Sidebar__List__Name__Text">
          List of {focus.property.objectType}
        </span>
        <Badge color="primary">{focus.results.length}</Badge>
      </div>
      <div className="Sidebar__List__Parent">
        <div>
          <strong>{focus.property.name}</strong> on
        </div>
        <div>
          {!focus.parent.objectSchema().primaryKey ? 'a ' : null}
          <span
            onClick={() =>
              onClassFocussed(focus.parent.objectSchema().name, focus.parent)
            }
            className="Sidebar__List__ParentObject"
            title={displayObject(focus.parent, true)}
          >
            {displayObject(focus.parent, false)}
          </span>
        </div>
      </div>
    </div>
  );
};

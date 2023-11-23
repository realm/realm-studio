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

import React from 'react';
import { Badge } from 'reactstrap';

import { ClassFocussedHandler } from '..';
import { displayObject } from '../display';
import { IListFocus, ISingleObjectFocus } from '../focus';

interface IParentObjectFocusProps {
  focus: IListFocus | ISingleObjectFocus;
  onClassFocussed: ClassFocussedHandler;
}

export const ParentObjectFocus = ({
  focus,
  onClassFocussed,
}: IParentObjectFocusProps) => (
  <div className="LeftSidebar__List">
    <div className="LeftSidebar__List__Name">
      {focus.kind === 'list' ? (
        <>
          <span className="LeftSidebar__List__Name__Text">
            List of {focus.property.objectType}
          </span>
          <Badge color="primary">
            {focus.parent.isValid() ? focus.results.length : '?'}
          </Badge>
        </>
      ) : focus.isEmbedded ? (
        <span className="LeftSidebar__List__Name__Text">
          Embedded {focus.property.objectType}
        </span>
      ) : null}
    </div>
    <div className="LeftSidebar__List__Parent">
      <div>
        <strong>{focus.property.name}</strong> on
        {!focus.parent.objectSchema().primaryKey ? ' a' : null}
      </div>
      {focus.parent.isValid() ? (
        <div
          className="LeftSidebar__List__ParentObject"
          onClick={() =>
            onClassFocussed(focus.parent.objectSchema().name, focus.parent)
          }
          title={displayObject(focus.parent, true)}
        >
          {displayObject(focus.parent, false)}
        </div>
      ) : (
        <div>deleted object</div>
      )}
    </div>
  </div>
);

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
import { Button } from 'reactstrap';

import { QuerySearch } from '../../reusable/QuerySearch';
import { Focus, getClassName } from '../focus';

import { QueryChangeHandler, EmbeddedInfo } from '.';

interface ITopBarProps {
  focus: Focus;
  onNewObjectClick?: (embeddedInfo?: EmbeddedInfo) => void;
  onQueryChange: QueryChangeHandler;
  onQueryHelp: () => void;
  query: string;
  queryError: Error | undefined;
  readOnly: boolean;
  allowCreate: boolean;
}

export const TopBar = ({
  focus,
  onNewObjectClick,
  onQueryChange,
  onQueryHelp,
  query,
  queryError,
  readOnly,
  allowCreate,
}: ITopBarProps) => {
  const className = getClassName(focus);
  let embeddedInfo: EmbeddedInfo | undefined;
  if (focus.isEmbedded && focus.kind === 'list' && focus.property.name) {
    embeddedInfo = {
      parent: focus.parent,
      key: focus.property.name,
    };
  }

  return (
    <div className="RealmBrowser__Topbar">
      <QuerySearch
        className="RealmBrowser__Topbar__Filter"
        onQueryChange={onQueryChange}
        onQueryHelp={onQueryHelp}
        query={query}
        queryError={queryError}
        placeholder="Enter a query to filter the list"
      />
      {allowCreate && !readOnly ? (
        <Button
          size="sm"
          color="secondary"
          className="RealmBrowser__Topbar__Button"
          onClick={() => onNewObjectClick && onNewObjectClick(embeddedInfo)}
          title={`Create ${className}`}
        >
          Create {className}
        </Button>
      ) : null}
    </div>
  );
};

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

import * as React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

export interface IQuerySearchProps {
  onQueryChange: (query: string) => void;
  onQueryHelp?: () => void;
  query: string;
  placeholder: string;
  className?: string;
}

export const QuerySearch = ({
  onQueryChange,
  onQueryHelp,
  query,
  placeholder,
  className,
}: IQuerySearchProps) => (
  <section className={className}>
    <InputGroup size="sm">
      <Input
        onChange={e => {
          onQueryChange(e.target.value);
        }}
        placeholder={placeholder}
        value={query}
      />
      {onQueryHelp && (
        <InputGroupAddon addonType="append">
          <Button onClick={onQueryHelp}>
            <i className="fa fa-question" aria-hidden="true" />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  </section>
);

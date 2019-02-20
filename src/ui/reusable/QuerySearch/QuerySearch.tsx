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
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Popover,
  PopoverBody,
} from 'reactstrap';

export interface IQuerySearchProps {
  onQueryChange: (query: string) => void;
  onQueryHelp?: () => void;
  onQueryBlur?: React.EventHandler<React.FocusEvent>;
  onQueryFocus?: React.EventHandler<React.FocusEvent>;
  query: string;
  queryError?: Error;
  placeholder: string;
  className?: string;
  inputRef: (inputElement: HTMLInputElement) => void;
  inputElement: HTMLElement | undefined;
  isPopoverOpen: boolean;
}

export const QuerySearch = ({
  onQueryChange,
  onQueryHelp,
  onQueryBlur,
  onQueryFocus,
  query,
  queryError,
  placeholder,
  className,
  inputRef,
  inputElement,
  isPopoverOpen,
}: IQuerySearchProps) => (
  <section className={className}>
    <InputGroup size="sm">
      <Input
        onChange={e => {
          onQueryChange(e.target.value);
        }}
        onFocus={onQueryFocus}
        onBlur={onQueryBlur}
        placeholder={placeholder}
        value={query}
        invalid={!!queryError}
        innerRef={inputRef}
      />
      {onQueryHelp && (
        <InputGroupAddon addonType="append">
          <Button onClick={onQueryHelp}>
            <i className="fa fa-question" aria-hidden="true" />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
    {inputElement && (
      <Popover
        isOpen={!!queryError && isPopoverOpen}
        target={inputElement}
        placement="bottom-start"
        hideArrow={true}
      >
        <PopoverBody>{queryError ? queryError.message : null}</PopoverBody>
      </Popover>
    )}
  </section>
);

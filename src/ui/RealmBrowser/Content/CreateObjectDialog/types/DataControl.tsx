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
import { Button, Input, InputGroup } from 'reactstrap';

import { IBaseControlProps } from './TypeControl';

export const DataControl = ({
  children,
  onChange,
  property,
  value,
}: IBaseControlProps) => {
  let fileInput: HTMLInputElement;
  return (
    <InputGroup className="CreateObjectDialog__DataControl">
      <Input
        className="CreateObjectDialog__DataControl__Input form-control"
        type="file"
        onChange={e => {
          if (fileInput && fileInput.files && fileInput.files.length >= 1) {
            const firstFile = fileInput.files.item(0);
            if (firstFile) {
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                onChange(reader.result);
              });
              reader.readAsArrayBuffer(firstFile);
            }
          }
        }}
        required={!property.optional}
        innerRef={(element: HTMLInputElement) => {
          fileInput = element;
        }}
        placeholder={value === null ? 'null' : ''}
      />
      {value !== null && property.optional ? (
        <Button
          size="sm"
          onClick={() => {
            if (fileInput) {
              // Reset the input field
              fileInput.value = '';
            }
            onChange(null);
          }}
        >
          <i className="fa fa-close" />
        </Button>
      ) : null}
      {children}
    </InputGroup>
  );
};

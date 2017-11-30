import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Input, InputGroup, InputGroupButton } from 'reactstrap';
import * as Realm from 'realm';

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
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              onChange(reader.result);
            });
            reader.readAsArrayBuffer(firstFile);
          }
        }}
        required={!property.optional}
        getRef={(element: HTMLInputElement) => {
          fileInput = element;
        }}
        placeholder={value === null ? 'null' : ''}
      />
      {value !== null && property.optional ? (
        <InputGroupButton>
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
        </InputGroupButton>
      ) : null}
      {children}
    </InputGroup>
  );
};

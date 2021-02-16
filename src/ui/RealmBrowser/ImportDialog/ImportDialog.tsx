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

import path from 'path';
import React from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap';

export interface IImportDialogProps {
  onCancel: () => void;
  onClassChange: (filePath: string, className: string) => void;
  onSubmit: (e: React.FormEvent<any>) => void;
  visible: boolean;
  filePaths: string[];
  classNames: string[];
  pathClassMapping: { [filePath: string]: string };
}

export const ImportDialog = ({
  onCancel,
  onClassChange,
  onSubmit,
  visible,
  filePaths,
  classNames,
  pathClassMapping,
}: IImportDialogProps) => (
  <Modal isOpen={visible} onExit={onCancel}>
    <Form onSubmit={onSubmit}>
      <ModalHeader>Import data</ModalHeader>
      <ModalBody>
        <p>Choose the destination class for each file below:</p>
        <Table>
          <thead>
          <tr>
            <th>File name</th>
            <th>Class</th>
          </tr>
          </thead>
          <tbody>
            {filePaths.map(filePath => (
              <tr key={filePath}>
                <td>{path.basename(filePath)}</td>
                <td>
                  <Input type="select" onChange={e => onClassChange(filePath, e.target.value)} value={pathClassMapping[filePath]}>
                    <option selected={pathClassMapping[filePath] === undefined} disabled>Select a class</option>
                    {classNames.map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </Input>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="primary">Import data</Button>
      </ModalFooter>
    </Form>
  </Modal>
);

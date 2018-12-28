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
import { Button, Input } from 'reactstrap';

import * as ros from '../../../../services/ros';
import { SidebarTable } from '../../../reusable';

import './MetadataTable.scss';

interface IMetadataTableProps {
  metadatas: ros.IUserMetadataRow[];
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
}

export const MetadataTable = ({
  metadatas,
  onMetadataAppended,
  onMetadataChanged,
  onMetadataDeleted,
}: IMetadataTableProps) => (
  <SidebarTable size="sm" className="MetadataTable">
    <thead>
      <tr>
        {/* We mention "Metadata" in this header, so we don't need a separate header */}
        <th>Metadata key</th>
        <th>Value</th>
        <th className="MetadataTable__ControlCell">
          <Button
            size="sm"
            onClick={onMetadataAppended}
            title="Click to add a new row of metadata"
          >
            +
          </Button>
        </th>
      </tr>
    </thead>
    <tbody>
      {metadatas.length === 0 ? (
        <tr>
          <td colSpan={3} className="MetadataTable__EmptyExplanation">
            This user has no metadata
          </td>
        </tr>
      ) : (
        metadatas.map((metadata, index) => {
          return (
            <tr key={index}>
              <td title={metadata.key}>
                <Input
                  value={metadata.key || ''}
                  bsSize="sm"
                  onChange={e => {
                    onMetadataChanged(
                      index,
                      e.target.value,
                      metadata.value || '',
                    );
                  }}
                />
              </td>
              <td title={metadata.value}>
                <Input
                  value={metadata.value || ''}
                  bsSize="sm"
                  onChange={e => {
                    onMetadataChanged(
                      index,
                      metadata.key || '',
                      e.target.value,
                    );
                  }}
                />
              </td>
              <td className="MetadataTable__ControlCell">
                <Button
                  size="sm"
                  title={
                    metadata.key
                      ? `Click to delete "${metadata.key}"`
                      : `Click to delete`
                  }
                  onClick={() => {
                    onMetadataDeleted(index);
                  }}
                >
                  ×
                </Button>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </SidebarTable>
);

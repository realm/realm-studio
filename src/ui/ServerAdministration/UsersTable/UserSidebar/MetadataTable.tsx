import * as React from 'react';
import { Button, Input, Table } from 'reactstrap';

import * as ros from '../../../../services/ros';

import './MetadataTable.scss';

export const MetadataTable = ({
  metadatas,
  onMetadataAppended,
  onMetadataChanged,
  onMetadataDeleted,
}: {
  metadatas: ros.IUserMetadataRow[];
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
}) => {
  return (
    <Table size="sm" className="MetadataTable">
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
                    size="sm"
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
                    size="sm"
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
    </Table>
  );
};

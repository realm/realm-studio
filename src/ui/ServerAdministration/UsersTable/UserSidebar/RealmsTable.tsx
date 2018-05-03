import * as React from 'react';
import { Table } from 'reactstrap';

import * as ros from '../../../../services/ros';
import { shortenRealmPath } from '../../utils';

import './RealmsTable.scss';

export const RealmsTable = ({
  realms,
}: {
  realms: Realm.Results<ros.IRealmFile>;
}) => (
  <Table size="sm" className="RealmsTable">
    <thead>
      <tr>
        {/* We mention "Realm" in this header, so we don't need a separate header */}
        <th>Realm path</th>
      </tr>
    </thead>
    <tbody>
      {realms.length === 0 ? (
        <tr>
          <td colSpan={1} className="RealmsTable__EmptyExplanation">
            This user has no realms
          </td>
        </tr>
      ) : (
        realms.map(realm => {
          return (
            <tr key={realm.path}>
              <td title={realm.path}>{shortenRealmPath(realm.path)}</td>
            </tr>
          );
        })
      )}
    </tbody>
  </Table>
);

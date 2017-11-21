import * as React from 'react';
import { Table } from 'reactstrap';

import * as ros from '../../../../services/ros';
import '../../sidebar/SidebarTable.scss';

export const RealmsTable = ({ realms }: { realms: ros.IRealmFile[] }) => (
  <Table size="sm" className="SidebarTable">
    <thead>
      <tr>
        {/* We mention "Realm" in this header, so we don't need a separate header */}
        <th>Realm path</th>
      </tr>
    </thead>
    <tbody>
      {realms.length === 0 ? (
        <tr>
          <td colSpan={1} className="SidebarTableEmptyExplanation">
            This user has no realms
          </td>
        </tr>
      ) : (
        realms.map(realm => {
          return (
            <tr key={realm.path}>
              <td title={realm.path}>{realm.path}</td>
            </tr>
          );
        })
      )}
    </tbody>
  </Table>
);

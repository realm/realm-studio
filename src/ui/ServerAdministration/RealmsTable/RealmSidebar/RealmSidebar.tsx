import * as React from 'react';
import * as Realm from 'realm';

import * as ros from '../../../../services/ros';
import { Sidebar } from '../../shared/Sidebar';

import { RealmSidebarCard } from './RealmSidebarCard';

import './RealmSidebar.scss';

export const RealmSidebar = ({
  getRealmPermissions,
  isOpen,
  onRealmDeletion,
  onRealmOpened,
  onRealmTypeUpgrade,
  onToggle,
  realm,
}: {
  getRealmPermissions: (path: string) => Realm.Results<ros.IPermission>;
  isOpen: boolean;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmTypeUpgrade: (path: string) => void;
  onToggle: () => void;
  realm?: ros.IRealmFile;
}) => {
  return (
    <Sidebar className="RealmSidebar" isOpen={isOpen} onToggle={onToggle}>
      {currentRealm &&
        currentRealm.isValid() && (
          <RealmSidebarCard
            getRealmPermissions={getRealmPermissions}
            onRealmDeletion={onRealmDeletion}
            onRealmOpened={onRealmOpened}
            onRealmTypeUpgrade={onRealmTypeUpgrade}
            realm={currentRealm}
          />
        )}
    </Sidebar>
  );
};

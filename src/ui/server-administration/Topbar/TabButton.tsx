import * as React from 'react';
import { Button } from 'reactstrap';

import { Tab } from '../ServerAdministration';

export interface ITabButtonProps {
  activeTab: Tab | null;
  label: string;
  onTabChanged: (tab: Tab) => void;
  tab: Tab;
}

export const TabButton = ({
  activeTab,
  label,
  onTabChanged,
  tab,
}: ITabButtonProps) => {
  return (
    <Button
      color={activeTab === tab ? 'primary' : 'secondary'}
      className="ServerAdministration__tab"
      onClick={() => {
        onTabChanged(tab);
      }}
    >
      {label}
    </Button>
  );
};

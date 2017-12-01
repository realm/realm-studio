import * as React from 'react';
import { Button } from 'reactstrap';

import './Dashboard.scss';

interface IDashboardProps {
  onShowCloudTutorial: () => void;
  isCloudTenant: boolean;
}

export const Dashboard = ({
  onShowCloudTutorial,
  isCloudTenant,
}: IDashboardProps) => (
  <section className="Dashboard">
    <Button onClick={onShowCloudTutorial}>Start the cloud tutorial!</Button>
  </section>
);

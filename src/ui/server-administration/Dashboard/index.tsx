import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../../actions/main';

import { Dashboard } from './Dashboard';

interface IDashboardContainerProps {
  isCloudTenant: boolean;
}

class DashboardContainer extends React.Component<IDashboardContainerProps, {}> {
  public render() {
    return <Dashboard isCloudTenant={this.props.isCloudTenant} {...this} />;
  }

  public onShowCloudTutorial = () => {
    main.showTutorial({ id: 'cloud-intro' });
  };
}

export { DashboardContainer as Dashboard };

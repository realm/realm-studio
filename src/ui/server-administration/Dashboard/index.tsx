import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../../actions/main';

import { Dashboard } from './Dashboard';

export type Platform = 'android' | 'apple' | 'javascript' | 'xamarin';

interface IDashboardContainerProps {
  isCloudTenant: boolean;
}

interface IDashboardContainerState {
  hoveringPlatform?: Platform;
  selectedPlatform?: Platform;
}

class DashboardContainer extends React.Component<
  IDashboardContainerProps,
  IDashboardContainerState
> {
  public render() {
    return (
      <Dashboard
        isCloudTenant={this.props.isCloudTenant}
        {...this.state}
        {...this}
      />
    );
  }

  public onShowCloudTutorial = () => {
    main.showTutorial({ id: 'cloud-intro' });
  };

  public onMouseEnterPlatform = (platform: Platform) => {
    this.setState({ hoveringPlatform: platform });
  };

  public onMouseLeavePlatform = () => {
    this.setState({ hoveringPlatform: undefined });
  };

  public onSelectPlatform = (platform: Platform) => {
    this.setState({ selectedPlatform: platform });
  };

  public onDeselectPlatform = () => {
    this.setState({ selectedPlatform: undefined });
  };
}

export { DashboardContainer as Dashboard };

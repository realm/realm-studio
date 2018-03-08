import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../../actions/main';

import { GettingStarted } from './GettingStarted';

export type Platform = 'android' | 'apple' | 'javascript' | 'xamarin';

interface IGettingStartedContainerProps {
  serverUrl: string;
}

class GettingStartedContainer extends React.Component<
  IGettingStartedContainerProps,
  {}
> {
  public render() {
    return (
      <GettingStarted
        serverUrl={this.normalizeUrl(this.props.serverUrl)}
        {...this.state}
        {...this}
      />
    );
  }

  public normalizeUrl = (url: string): string => {
    // Strip protocol
    url = url.replace(/(^\w+:|^)\/\//, '');
    // Strip / suffix
    url = url.replace(/\/$/, '');
    return url;
  }

  public onShowTutorial = (name: 'ios' | 'android' | 'cloud') => {
    if (name === 'cloud') {
      main.showTutorial({
        type: 'tutorial',
        id: 'cloud-intro',
        context: {
          serverUrl: this.props.serverUrl,
        },
      });
    } else if (name === 'ios') {
      electron.shell.openExternal('https://docs.realm.io/cloud/ios-demo-app');
    } else if (name === 'android') {
      electron.shell.openExternal(
        'https://docs.realm.io/cloud/android-demo-app',
      );
    }
  };
}

export { GettingStartedContainer as GettingStarted };

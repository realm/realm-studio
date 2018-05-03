import * as React from 'react';

import { Platform } from '..';

import { PlatformOverlay } from './PlatformOverlay';

interface IPlatformOverlayContainerProps {
  onClose: () => void;
  platform: Platform;
}

class PlatformOverlayContainer extends React.Component<
  IPlatformOverlayContainerProps,
  {}
> {
  public render() {
    return <PlatformOverlay onClose={this.props.onClose} />;
  }
}

export { PlatformOverlayContainer as PlatformOverlay };

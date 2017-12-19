import * as React from 'react';

import { Tutorial } from '../ui/Tutorial';
import { Window } from './Window';
import { ITutorialWindowProps } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class TutorialWindow extends Window<ITutorialWindowProps, {}> {
  public render() {
    return <Tutorial {...this.props} />;
  }

  protected getTrackedProperties() {
    return {
      ...super.getTrackedProperties(),
      id: this.props.id,
    };
  }
}

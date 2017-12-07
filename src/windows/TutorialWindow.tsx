import * as React from 'react';

import { Tutorial } from '../ui/Tutorial';
import { Window } from './Window';
import { ITutorialOptions } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class TutorialWindow extends Window<
  {
    options: ITutorialOptions;
  },
  {}
> {
  public render() {
    return <Tutorial {...this.props.options} />;
  }

  public getTrackedProperties() {
    return {
      id: this.props.options.id,
    };
  }
}

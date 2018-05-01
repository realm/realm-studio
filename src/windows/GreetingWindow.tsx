import * as React from 'react';

import { Greeting } from '../ui/Greeting';
import { Window } from './Window';
import { IGreetingWindowProps } from './WindowType';

export class GreetingWindow extends Window<IGreetingWindowProps, {}> {
  public render() {
    return <Greeting />;
  }
}

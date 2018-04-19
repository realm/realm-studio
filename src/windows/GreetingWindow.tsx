import * as React from 'react';

import { GreetingContainer } from '../ui/Greeting/GreetingContainer';
import { Window } from './Window';
import { IGreetingWindowProps } from './WindowType';

export class GreetingWindow extends Window<IGreetingWindowProps, {}> {
  public render() {
    return <GreetingContainer />;
  }
}

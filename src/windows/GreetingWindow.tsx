import * as React from 'react';

import { GreetingContainer } from '../ui/greeting/GreetingContainer';
import { Window } from './Window';

export class GreetingWindow extends Window<{}, {}> {
  public render() {
    return <GreetingContainer />;
  }
}

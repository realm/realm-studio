import * as React from 'react';

import { CloudAuthentication } from '../ui/CloudAuthentication';
import { Window } from './Window';
import { ICloudAuthenticationWindowProps } from './WindowType';

export class CloudAuthenticationWindow extends Window<
  ICloudAuthenticationWindowProps,
  {}
> {
  public render() {
    return <CloudAuthentication message={this.props.message} />;
  }
}

import * as React from 'react';

import { CloudAdministrationContainer } from '../ui/cloud-administration/CloudAdministrationContainer';
import { Window } from './Window';
import { ICloudAdministrationWindowProps } from './WindowType';

export class CloudAdministrationWindow extends Window<
  ICloudAdministrationWindowProps,
  {}
> {
  public render() {
    return <CloudAdministrationContainer />;
  }
}

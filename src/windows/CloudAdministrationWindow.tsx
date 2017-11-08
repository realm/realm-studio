import * as React from 'react';

import { CloudAdministrationContainer } from '../ui/cloud-administration/CloudAdministrationContainer';
import { Window } from './Window';

export class CloudAdministrationWindow extends Window<{}, {}> {
  public render() {
    return <CloudAdministrationContainer />;
  }
}

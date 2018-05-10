import * as React from 'react';

import { ServerAdministration } from '../ui/ServerAdministration';
import { Window } from './Window';
import { IServerAdministrationWindowProps } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class ServerAdministrationWindow extends Window<
  IServerAdministrationWindowProps,
  {}
> {
  public render() {
    return (
      <ServerAdministration
        onValidateCertificatesChange={this.onValidateCertificatesChange}
        {...this.props}
      />
    );
  }

  protected getTrackedProperties() {
    return {
      ...super.getTrackedProperties(),
      url: this.props.credentials.url,
    };
  }

  protected onValidateCertificatesChange = (validateCertificates: boolean) => {
    const url = new URL(location.href);
    const props = { ...this.props };
    props.validateCertificates = validateCertificates;
    url.searchParams.set('props', JSON.stringify(props));
    location.replace(url.toString());
  };
}

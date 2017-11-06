import * as React from 'react';

import { ServerAdministrationContainer } from '../ui/server-administration/ServerAdministrationContainer';
import { Window } from './Window';
import { IServerAdministrationOptions } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class ServerAdministrationWindow extends Window<
  {
    options: IServerAdministrationOptions;
  },
  {}
> {
  public render() {
    return (
      <ServerAdministrationContainer
        {...this.props.options}
        onValidateCertificatesChange={this.onValidateCertificatesChange}
      />
    );
  }

  protected getTrackedProperties() {
    return {
      url: this.props.options.credentials.url,
    };
  }

  protected onValidateCertificatesChange = (validateCertificates: boolean) => {
    const url = new URL(location.href);
    const options = { ...this.props.options };
    options.validateCertificates = validateCertificates;
    url.searchParams.set('options', JSON.stringify(options));
    location.replace(url.toString());
  };
}

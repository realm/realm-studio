////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

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

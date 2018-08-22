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

import * as sentry from '@sentry/electron';
import * as electron from 'electron';
import * as React from 'react';

import { IPC_EVENT_ID, IPC_SEND_EVENT_ID } from '../../sentry';
import { ErrorOverlay } from './ErrorOverlay';

interface ISentryErrorBoundaryProps {
  children: React.ReactChild;
}

interface INormalState {
  status: 'normal';
}

interface IErrorState {
  status: 'error';
  error: Error;
  info: React.ErrorInfo;
  eventId?: string;
}

interface ISentryIdMessage {
  id: string;
}

type ISentryErrorBoundaryState = INormalState | IErrorState;

export class SentryErrorBoundary extends React.Component<
  ISentryErrorBoundaryProps,
  ISentryErrorBoundaryState
> {
  public state: ISentryErrorBoundaryState = {
    status: 'normal',
  };

  public componentDidMount() {
    electron.ipcRenderer.addListener(IPC_EVENT_ID, this.onSentryEventId);
  }

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(IPC_EVENT_ID, this.onSentryEventId);
  }

  public render() {
    return this.state.status === 'error' ? (
      <ErrorOverlay
        error={this.state.error}
        info={this.state.info}
        eventId={this.state.eventId}
      />
    ) : (
      this.props.children
    );
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Ask the main process to send the event id
    electron.ipcRenderer.send(IPC_SEND_EVENT_ID);
    // Configure the scope to include the componentStack
    sentry.configureScope(scope => {
      scope.setExtra('componentStack', info.componentStack);
    });
    // Capture the event
    sentry.captureException(error);
    // Update the state
    this.setState({ status: 'error', error, info });
  }

  private onSentryEventId = (e: electron.Event, { id }: ISentryIdMessage) => {
    this.setState({ status: 'error', eventId: id });
  };
}

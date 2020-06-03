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

import React from 'react';
import { CellMeasurerCache } from 'react-virtualized';

import { ILoadingProgress } from '../../reusable/LoadingOverlay';

import { ILogEntry } from './Entry';
import { Log } from './Log';

export enum LogLevel {
  fatal = 'fatal',
  error = 'error',
  warn = 'warn',
  info = 'info',
  detail = 'detail',
  debug = 'debug',
  trace = 'trace',
  all = 'all',
}

export interface ILogContainerProps {
  serverUrl: string;
  token: string;
}

export interface ILogContainerState {
  entries: ILogEntry[];
  isLevelSelectorOpen: boolean;
  level: LogLevel;
  progress: ILoadingProgress;
}

class LogContainer extends React.Component<
  ILogContainerProps,
  ILogContainerState
> {
  public state: ILogContainerState = {
    entries: [],
    isLevelSelectorOpen: false,
    level: LogLevel.info,
    progress: { status: 'idle' },
  };

  private socket?: WebSocket;
  private cellMeasurerCache: CellMeasurerCache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 20,
  });

  public render() {
    return (
      <Log
        cellMeasurerCache={this.cellMeasurerCache}
        onLevelChanged={this.onLevelChanged}
        toggleLevelSelector={this.toggleLevelSelector}
        {...this.state}
      />
    );
  }

  public componentDidUpdate(
    props: ILogContainerProps,
    state: ILogContainerState,
  ) {
    if (this.state.level !== state.level) {
      this.connect();
    }
  }

  public componentDidMount() {
    this.connect();
    window.addEventListener('resize', this.onWindowResize);
  }

  public componentWillUnmount() {
    this.disconnect();
    window.removeEventListener('resize', this.onWindowResize);
  }

  public onLevelChanged = (level: LogLevel) => {
    this.setState({
      level,
    });
  };

  public toggleLevelSelector = () => {
    this.setState({
      isLevelSelectorOpen: !this.state.isLevelSelectorOpen,
    });
  };

  protected connect() {
    this.setState({
      progress: {
        status: 'in-progress',
        message: 'Connecting ...',
      },
    });

    if (this.socket) {
      this.disconnect();
      this.setState({
        entries: [],
      });
      // Clear the cell cache
      this.cellMeasurerCache.clearAll();
    }

    const url = this.generateLogUrl();
    this.socket = new WebSocket(url);
    this.socket.addEventListener('open', e => {
      this.setState({
        progress: {
          status: 'in-progress',
          message: 'Authenticating ...',
        },
      });

      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            action: 'authenticate',
            token: this.props.token,
          }),
        );
      }
    });
    this.socket.addEventListener('message', this.onLogMessage);
  }

  protected disconnect() {
    if (this.socket) {
      this.socket.close();
      delete this.socket;
    }
  }

  protected generateLogUrl() {
    const url = new URL(this.props.serverUrl);
    // Use ws instead of http
    url.protocol = url.protocol.replace('http', 'ws');
    // Replace the path
    url.pathname = `/log/${this.state.level}`;
    return url.toString();
  }

  protected onLogMessage = (e: MessageEvent) => {
    const newEntries = JSON.parse(e.data).reverse();
    this.setState({
      entries: this.state.entries.concat(newEntries),
    });
    // If the progress is not done - update it on the first message
    if (this.state.progress.status !== 'done') {
      this.setState({ progress: { status: 'done' } });
    }
  };

  protected onWindowResize = () => {
    this.cellMeasurerCache.clearAll();
  };
}

export { LogContainer as Log };

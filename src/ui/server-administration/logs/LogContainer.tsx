import * as React from 'react';
import * as Realm from 'realm';

import { ILogEntry } from './Entry';
import { LogLevel } from './LevelSelector';
import { Log } from './Log';

export interface ILogContainerProps {
  user: Realm.Sync.User;
}

export interface ILogContainerState {
  entries: ILogEntry[];
  isLevelSelectorOpen: boolean;
  level: LogLevel;
}

export class LogContainer extends React.Component<
  ILogContainerProps,
  ILogContainerState
> {
  private socket: WebSocket | null;

  constructor() {
    super();
    this.state = {
      entries: [],
      isLevelSelectorOpen: false,
      level: LogLevel.info,
    };
  }

  public render() {
    return (
      <Log
        isLevelSelectorOpen={this.state.isLevelSelectorOpen}
        {...this.state}
        {...this}
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
  }

  public componentWillUnmount() {
    this.disconnect();
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

  private connect() {
    if (this.socket) {
      this.disconnect();
      this.setState({
        entries: [],
      });
    }

    const url = this.generateLogUrl();
    const userRefreshToken = this.props.user.token;
    this.socket = new WebSocket(url);
    this.socket.addEventListener('open', e => {
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            action: 'authenticate',
            token: this.props.user.token,
          }),
        );
      }
    });
    this.socket.addEventListener('message', this.onLogMessage);
  }

  private disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private generateLogUrl() {
    const url = new URL(this.props.user.server);
    // Use ws instead of http
    url.protocol = url.protocol.replace('http', 'ws');
    // Replace the path
    url.pathname = `/log/${this.state.level}`;
    return url.toString();
  }

  private onLogMessage = (e: MessageEvent) => {
    const newEntries = JSON.parse(e.data);
    this.setState({
      entries: newEntries.concat(this.state.entries),
    });
  };
}

import * as React from 'react';

import { CreateRealmDialog } from './CreateRealmDialog';

export interface ICreateRealmDialogContainerProps {
  isOpen: boolean;
  onRealmCreated: (path: string) => void;
  toggle: () => void;
}

export interface ICreateRealmDialogContainerState {
  path: string;
}

export class CreateRealmDialogContainer extends React.Component<
  ICreateRealmDialogContainerProps,
  ICreateRealmDialogContainerState
> {
  public constructor() {
    super();
    this.state = {
      path: '',
    };
  }

  public render() {
    return <CreateRealmDialog {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { path } = this.state;
    this.setState({
      path: '',
    });
    this.props.toggle();
    this.props.onRealmCreated(path);
  };

  public onPathChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      path: e.target.value,
    });
  };
}

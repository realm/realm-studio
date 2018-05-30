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

class CreateRealmDialogContainer extends React.Component<
  ICreateRealmDialogContainerProps,
  ICreateRealmDialogContainerState
> {
  public state: ICreateRealmDialogContainerState = {
    path: '',
  };

  public render() {
    return <CreateRealmDialog {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { path } = this.state;
    // Await the realm being created
    await this.props.onRealmCreated(path);
    // Reset the state
    this.setState({
      path: '',
    });
    // And hide the dialog
    this.props.toggle();
  };

  public onPathChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      path: e.target.value,
    });
  };
}

export { CreateRealmDialogContainer as CreateRealmDialog };

import * as React from 'react';

import { EncryptionDialog } from './EncryptionDialog';

export interface IEncryptionDialogContainerProps {
  onHide: () => void;
  onOpenWithEncryption: (key: string) => void;
  visible: boolean;
}

export interface IEncryptionDialogContainerState {
  key: string;
}

export class EncryptionDialogContainer extends React.Component<
  IEncryptionDialogContainerProps,
  IEncryptionDialogContainerState
> {
  public render() {
    return (
      <EncryptionDialog
        onExit={this.props.onHide}
        onKeyChange={this.onKeyChange}
        onSubmit={this.onSubmit}
        visible={this.props.visible}
      />
    );
  }

  protected onKeyChange = (key: string) => {
    this.setState({ key });
  };

  protected onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    this.props.onHide();
    this.props.onOpenWithEncryption(this.state.key);
  };
}

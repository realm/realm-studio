import * as React from 'react';

import { UploadRealmDialog } from './UploadRealmDialog';

export interface IUploadRealmDialogContainerProps {
  isOpen: boolean;
  onRealmUpload: (localPath: string, serverPath: string) => void;
  toggle: () => void;
}

export interface IUploadRealmDialogContainerState {
  localPath: string;
  serverPath: string;
}

class UploadRealmDialogContainer extends React.Component<
  IUploadRealmDialogContainerProps,
  IUploadRealmDialogContainerState
> {
  public constructor() {
    super();
    this.state = {
      localPath: '',
      serverPath: '',
    };
  }

  public render() {
    return <UploadRealmDialog {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { localPath, serverPath } = this.state;
    // Await the realm being created
    await this.props.onRealmUpload(localPath, serverPath);
    // Reset the state
    this.setState({
      localPath: '',
      serverPath: '',
    });
    // And hide the dialog
    this.props.toggle();
  };

  public onLocalPathChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      localPath: e.target.files ? e.target.files[0].path : '',
    });
  };

  public onServerPathChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      serverPath: e.target.value,
    });
  };
}

export { UploadRealmDialogContainer as UploadRealmDialog };

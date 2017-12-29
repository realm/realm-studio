import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import * as ros from '../../../services/ros';

import { showError } from '../../reusable/errors';
import { querySomeFieldContainsText } from '../utils';
import { RealmsTable } from './RealmsTable';

export type ValidateCertificatesChangeHandler = (
  validateCertificates: boolean,
) => void;

export interface IRealmTableContainerProps {
  adminRealm: Realm;
  adminRealmChanges: number;
  onRealmOpened: (path: string) => void;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
  user: Realm.Sync.User;
  validateCertificates: boolean;
}

export interface IRealmTableContainerState {
  selectedRealmPath: string | null;
  isCreateRealmOpen: boolean;
  query: string;
}

export class RealmsTableContainer extends React.PureComponent<
  IRealmTableContainerProps,
  IRealmTableContainerState
> {
  protected realms: Realm.Results<ros.IRealmFile>;

  constructor() {
    super();
    this.state = {
      isCreateRealmOpen: false,
      selectedRealmPath: null,
      query: '',
    };
  }

  public componentWillMount() {
    this.setRealms();
  }

  public render() {
    return <RealmsTable realms={this.realms} {...this.state} {...this} />;
  }

  public getRealmFromId = (path: string): ros.IRealmFile | null => {
    const { adminRealm } = this.props;
    return adminRealm.objectForPrimaryKey<ros.IRealmFile>('RealmFile', path);
  };

  public getRealmPermissions = (
    path: string,
  ): Realm.Results<ros.IPermission> => {
    const { adminRealm } = this.props;
    const realmFile = this.getRealmFromId(path);
    return adminRealm
      .objects<ros.IPermission>('Permission')
      .filtered('realmFile == $0', realmFile);
  };

  public onRealmDeletion = async (path: string) => {
    const confirmed = await this.confirmRealmDeletion(path);
    if (confirmed) {
      try {
        await ros.realms.remove(this.props.user, path);
        if (path === this.state.selectedRealmPath) {
          this.onRealmSelected(null);
        }
      } catch (err) {
        showError('Error deleting realm', err);
      }
    }
  };

  public onRealmCreated = async (path: string) => {
    const realm = await ros.realms.create(this.props.user, path);
    // Close the Realm right away - we don't need it open
    realm.close();
    // Cannot use the realm.path as that is the local path
    // Instead - let's just select the latest Realm
    if (this.realms) {
      const lastRealm = this.realms[this.realms.length - 1];
      this.onRealmSelected(lastRealm.path);
    }
  };

  public toggleCreateRealm = () => {
    this.setState({
      isCreateRealmOpen: !this.state.isCreateRealmOpen,
    });
  };

  public onRealmOpened = (path: string) => {
    this.props.onRealmOpened(path);
    // Make sure the Realm that just got opened, is selected
    this.onRealmSelected(path);
  };

  public onRealmSelected = (path: string | null) => {
    this.setState({
      selectedRealmPath: path,
    });
  };

  public onQueryChange = (query: string) => {
    this.setState({ query });
    this.setRealms(query);
  };

  protected setRealms(query?: string) {
    if (!query || query === '') {
      this.realms = this.props.adminRealm.objects<ros.IRealmFile>('RealmFile');
    } else {
      try {
        this.realms = this.props.adminRealm
          .objects<ros.IRealmFile>('RealmFile')
          .filtered(
            querySomeFieldContainsText(
              ['path', 'owner.accounts.providerId'],
              query,
            ),
          );
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Could not filter on "${query}"`, err);
      }
    }
  }

  private confirmRealmDeletion(path: string): boolean {
    const result = electron.remote.dialog.showMessageBox(
      electron.remote.getCurrentWindow(),
      {
        type: 'warning',
        message:
          'Before deleting the Realm here, make sure that any / all clients (iOS, Android, Js, etc.) has already deleted the app or database locally. If this is not done, they will try to upload their copy of the database - which might have been replaced in the meantime.',
        title: `Deleting ${path}`,
        buttons: ['Cancel', 'Delete'],
      },
    );

    return result === 1;
  }
}

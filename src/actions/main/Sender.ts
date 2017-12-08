import { MainActions } from '../../main/MainActions';
import { ActionSender } from '../ActionSender';

import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
  ITutorialOptions,
} from '../../windows/WindowType';

export class Sender extends ActionSender {
  public authenticateWithGitHub(): Promise<void> {
    return this.send(MainActions.AuthenticateWithGitHub);
  }

  public checkForUpdates() {
    return this.send(MainActions.CheckForUpdates);
  }

  public deauthenticate(): Promise<void> {
    return this.send(MainActions.Deauthenticate);
  }

  public refreshCloudStatus() {
    return this.send(MainActions.RefreshCloudStatus);
  }

  public showCloudAdministration() {
    return this.send(MainActions.ShowCloudAdministration);
  }

  public showConnectToServer(url?: string) {
    return this.send(MainActions.ShowConnectToServer, url);
  }

  public showGreeting() {
    return this.send(MainActions.ShowGreeting);
  }

  public showOpenLocalRealm() {
    return this.send(MainActions.ShowOpenLocalRealm);
  }

  public showRealmBrowser(options: IRealmBrowserOptions) {
    return this.send(MainActions.ShowRealmBrowser, options);
  }

  public showServerAdministration(options: IServerAdministrationOptions) {
    return this.send(MainActions.ShowServerAdministration, options);
  }

  public showTutorial(options: ITutorialOptions) {
    return this.send(MainActions.ShowTutorial, options);
  }
}

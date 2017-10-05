import { MainActions } from '../../main/MainActions';
import { ActionSender } from '../ActionSender';

import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
} from '../../windows/WindowType';

export class Sender extends ActionSender {
  public checkForUpdates() {
    return this.send(MainActions.CheckForUpdates);
  }

  public showConnectToServer() {
    return this.send(MainActions.ShowConnectToServer);
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
}

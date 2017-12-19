import { MainActions } from '../../main/MainActions';
import { ImportFormat } from '../../services/data-importer';
import {
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
  ITutorialWindowProps,
} from '../../windows/WindowType';
import { ActionSender } from '../ActionSender';
import { LoopbackTransport, RendererTransport } from '../transports';

export class Sender extends ActionSender {
  constructor() {
    super();
    // Use the renderer transport if the sender is accessed from the renderer and the loopback otherwise.
    const isRenderer = process.type === 'renderer';
    this.setTransport(
      isRenderer ? new RendererTransport() : LoopbackTransport.getInstance(),
    );
  }

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

  public showImportData(format: ImportFormat) {
    return this.send(MainActions.ShowImportData, format);
  }

  public showRealmBrowser(props: IRealmBrowserWindowProps) {
    return this.send(MainActions.ShowRealmBrowser, props);
  }

  public showServerAdministration(props: IServerAdministrationWindowProps) {
    return this.send(MainActions.ShowServerAdministration, props);
  }

  public showTutorial(props: ITutorialWindowProps) {
    return this.send(MainActions.ShowTutorial, props);
  }
}

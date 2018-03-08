import { MainActions } from '../../main/MainActions';
import { ImportFormat } from '../../services/data-importer';
import * as raas from '../../services/raas';
import {
  ICloudAuthenticationWindowProps,
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

  public authenticateWithEmail(
    email: string,
    password: string,
  ): Promise<raas.user.IAuthResponse> {
    return this.send(MainActions.AuthenticateWithEmail, email, password);
  }

  public authenticateWithGitHub(): Promise<raas.user.IAuthResponse> {
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

  public setRaasEndpoint(endpoint: raas.Endpoint) {
    return this.send(MainActions.SetRaasEndpoint, endpoint);
  }

  public showCloudAuthentication(
    props: ICloudAuthenticationWindowProps = { type: 'cloud-authentication' },
    resolveUser: boolean = false,
  ) {
    return this.send(MainActions.ShowCloudAuthentication, props, resolveUser);
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

  public showTutorial(options: ITutorialWindowProps) {
    return this.send(MainActions.ShowTutorial, options);
  }
}

import { MainActions } from '../../main/MainActions';
import { ImportFormat } from '../../services/data-importer';
import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
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

  public showImportData(format: ImportFormat) {
    return this.send(MainActions.ShowImportData, format);
  }

  public showRealmBrowser(options: IRealmBrowserOptions) {
    return this.send(MainActions.ShowRealmBrowser, options);
  }

  public showServerAdministration(options: IServerAdministrationOptions) {
    return this.send(MainActions.ShowServerAdministration, options);
  }
}

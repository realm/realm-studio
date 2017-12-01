import * as github from '../services/github';
import * as raas from '../services/raas';
import * as ros from '../services/ros';

export interface ICloudStatus {
  endpoint: raas.Endpoint;
  primarySubscription?: raas.user.ISubscription;
  primarySubscriptionCredentials?: ros.IServerCredentials;
  raasToken: string;
}

type CloudStatusListener = (status: ICloudStatus) => void;

/*
 * This will manage and send events when
 */
export class CloudManager {
  private listeningWindows: Electron.BrowserWindow[] = [];
  private listeners: CloudStatusListener[] = [];

  public addListeningWindow(window: Electron.BrowserWindow) {
    this.listeningWindows.push(window);
  }

  public removeListeningWindow(window: Electron.BrowserWindow) {
    const index = this.listeningWindows.indexOf(window);
    this.listeningWindows.splice(index, 1);
  }

  public addListener(listener: CloudStatusListener) {
    this.listeners.push(listener);
  }

  public removeListener(listener: CloudStatusListener) {
    const index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);
  }

  public async authenticateWithGitHub() {
    const code = await github.authenticate();
    const response = await raas.user.authenticate(code);
    raas.user.setToken(response.token);
    this.refresh();
  }

  public async deauthenticate() {
    raas.user.forgetToken();
    this.refresh();
  }

  public setEndpoint(endpoint: raas.Endpoint) {
    raas.setEndpoint(endpoint);
  }

  public async refresh() {
    const raasToken = raas.user.getToken();
    const endpoint = raas.getEndpoint();
    if (raasToken) {
      const subscriptions = await raas.user.getSubscriptions();
      const primarySubscription =
        subscriptions.length >= 1 ? subscriptions[0] : undefined;
      const primarySubscriptionCredentials = primarySubscription
        ? raas.user.getTenantCredentials(primarySubscription.tenantUrl)
        : undefined;
      this.sendCloudStatus({
        endpoint,
        primarySubscription,
        primarySubscriptionCredentials,
        raasToken,
      });
    } else {
      this.sendCloudStatus({
        endpoint,
        raasToken,
      });
    }
  }

  protected sendCloudStatus(status: ICloudStatus) {
    this.listeners.forEach(listener => {
      listener(status);
    });
    this.listeningWindows.forEach(window => {
      window.webContents.send('cloud-status', status);
    });
  }
}

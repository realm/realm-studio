import * as github from '../services/github';
import * as raas from '../services/raas';
import * as ros from '../services/ros';

interface IBaseCloudStatus {
  kind: string;
  endpoint: raas.Endpoint;
}

export interface INotAuthenticatedCloudStatus extends IBaseCloudStatus {
  kind: 'not-authenticated';
}

export interface IAuthenticatingCloudStatus extends IBaseCloudStatus {
  kind: 'authenticating';
}

export interface IAuthenticatedCloudStatus extends IBaseCloudStatus {
  kind: 'authenticated';
  justAuthenticated: boolean;
  raasToken: string;
  user: raas.user.IMeResponse;
}

export interface IPrimarySubscriptionCloudStatus extends IBaseCloudStatus {
  kind: 'has-primary-subscription';
  primarySubscription: raas.user.ISubscription;
  raasToken: string;
  user: raas.user.IMeResponse;
}

export type ICloudStatus =
  | INotAuthenticatedCloudStatus
  | IAuthenticatingCloudStatus
  | IAuthenticatedCloudStatus
  | IPrimarySubscriptionCloudStatus;

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
    const endpoint = raas.getEndpoint();
    this.sendCloudStatus({
      kind: 'authenticating',
      endpoint,
    });
    const code = await github.authenticate();
    const response = await raas.user.authenticate(code);
    raas.user.setToken(response.token);
    // Learn about the user
    const user = await raas.user.getAuth();
    this.sendCloudStatus({
      kind: 'authenticated',
      endpoint,
      justAuthenticated: true,
      raasToken: response.token,
      user,
    });
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
      const user = await raas.user.getAuth();
      const subscriptions = await raas.user.getSubscriptions();
      if (subscriptions.length > 0) {
        const primarySubscription = subscriptions[0];
        this.sendCloudStatus({
          kind: 'has-primary-subscription',
          endpoint,
          primarySubscription,
          raasToken,
          user,
        });
      } else {
        this.sendCloudStatus({
          kind: 'authenticated',
          endpoint,
          justAuthenticated: false,
          raasToken,
          user,
        });
      }
    } else {
      this.sendCloudStatus({
        kind: 'not-authenticated',
        endpoint,
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

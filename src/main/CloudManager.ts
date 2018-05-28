import * as github from '../services/github';
import * as raas from '../services/raas';
import * as ros from '../services/ros';
import { timeout } from '../utils';

export type IInstance = raas.user.ISubscription;

interface IBaseCloudStatus {
  kind: string;
  endpoint: raas.Endpoint;
}

export interface IErrorCloudStatus extends IBaseCloudStatus {
  kind: 'error';
  message: string;
}

export interface IFetchingCloudStatus extends IBaseCloudStatus {
  kind: 'fetching';
}

export interface INotAuthenticatedCloudStatus extends IBaseCloudStatus {
  kind: 'not-authenticated';
}

export interface IAuthenticatingCloudStatus extends IBaseCloudStatus {
  kind: 'authenticating';
  waitingForUser: boolean;
}

export interface IAuthenticatedCloudStatus extends IBaseCloudStatus {
  kind: 'authenticated';
  justAuthenticated: boolean;
  instances: IInstance[];
  raasToken: string;
  account: raas.user.IAccountResponse;
}

export type ICloudStatus =
  | IErrorCloudStatus
  | IFetchingCloudStatus
  | INotAuthenticatedCloudStatus
  | IAuthenticatingCloudStatus
  | IAuthenticatedCloudStatus;

type CloudStatusListener = (status: ICloudStatus) => void;

/*
 * This will manage and send events when
 */
export class CloudManager {
  private static AUTHENTICATION_TIMEOUT = 5000;
  private listeningWindows: Electron.BrowserWindow[] = [];
  private listeners: CloudStatusListener[] = [];
  private lastGitHubState?: string;

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
      waitingForUser: true,
      endpoint,
    });
    const code = await github.authenticate(undefined, state => {
      this.lastGitHubState = state;
    });
    // Forget the github state again ...
    delete this.lastGitHubState;
    // Authenticate with the newly obtained GitHub code
    return this.authenticate(() => {
      return raas.user.authenticateWithGitHub(code);
    });
  }

  public async authenticateWithEmail(email: string, password: string) {
    return this.authenticate(() => {
      return raas.user.authenticateWithEmail(email, password);
    });
  }

  public async deauthenticate() {
    raas.user.forgetToken();
    this.refresh();
  }

  public setEndpoint(endpoint: raas.Endpoint) {
    raas.setEndpoint(endpoint);
  }

  public async refresh(justAuthenticated = false) {
    const endpoint = raas.getEndpoint();
    try {
      const raasToken = raas.user.getToken();
      if (raasToken) {
        this.sendCloudStatus({
          kind: 'fetching',
          endpoint,
        });
        const account = await raas.user.getAccount();
        // We use "instance" internally instead of subscriptions
        const instances = await raas.user.getSubscriptions();
        const status: IAuthenticatedCloudStatus = {
          kind: 'authenticated',
          account,
          endpoint,
          justAuthenticated,
          raasToken,
          instances,
        };
        this.sendCloudStatus(status);
      } else {
        this.sendCloudStatus({
          kind: 'not-authenticated',
          endpoint,
        });
      }
    } catch (err) {
      this.sendCloudStatus({
        kind: 'error',
        message: err.message,
        endpoint,
      });
    }
  }

  public reopenGitHubUrl() {
    if (this.lastGitHubState) {
      github.openUrl(this.lastGitHubState);
    } else {
      throw new Error('Expected an active GitHub authenticating state');
    }
  }

  protected async authenticate(
    performAuthentication: () => Promise<raas.user.IAuthResponse>,
  ) {
    const endpoint = raas.getEndpoint();
    try {
      this.sendCloudStatus({
        kind: 'authenticating',
        waitingForUser: false,
        endpoint,
      });
      const response = await timeout<raas.user.IAuthResponse>(
        CloudManager.AUTHENTICATION_TIMEOUT,
        new Error(
          `Request timed out (waited ${
            CloudManager.AUTHENTICATION_TIMEOUT
          } ms)`,
        ),
        performAuthentication(),
      );
      raas.user.setToken(response.token);
      this.refresh(true);
      return response;
    } catch (err) {
      this.sendCloudStatus({
        kind: 'error',
        message: err.message,
        endpoint,
      });
      // Allow callers to catch this error too, by rethrowing
      throw err;
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

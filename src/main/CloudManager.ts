import * as github from '../services/github';
import * as raas from '../services/raas';
import * as ros from '../services/ros';

export interface ICloudStatus {
  raasToken: string;
  defaultTenant?: raas.IDefaultTenant;
}

type CloudStatusListener = (status: ICloudStatus) => void;

/*
 * This will manage and send events when
 */
export class CloudManager {
  private listeningWindows: Electron.BrowserWindow[] = [];
  private listeners: CloudStatusListener[] = [];

  public async authenticateWithGitHub() {
    const code = await github.authenticate();
    const response = await raas.authenticate(code);
    raas.setToken(response.token);
    this.refresh();
  }

  public async deauthenticate() {
    // Close any default cloud instance
    const defaultTenant = raas.getDefaultTenant();
    if (defaultTenant) {
      await raas.deleteTenant(defaultTenant.controllerUrl, defaultTenant.id);
      raas.forgetDefaultTenant();
    }
    raas.forgetToken();
    this.refresh();
  }

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

  public refresh() {
    this.sendCloudStatus({
      raasToken: raas.getToken(),
      defaultTenant: raas.getDefaultTenant(),
    });
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

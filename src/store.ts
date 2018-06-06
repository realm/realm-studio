// TODO: Replace this with a Realm as soon as we don't need to CWD in the renderer.
// @see https://github.com/realm/realm-studio/blob/master/src/renderer.tsx#L15-L30

import ElectronStore = require('electron-store');
export { store };

class RealmStudioStore {
  public readonly KEY_SHOW_PARTIAL_REALMS = 'realmlist.show-partial-realms';
  public readonly KEY_SHOW_SYSTEM_REALMS = 'realmlist.show-system-realms';
  public readonly KEY_SHOW_SYSTEM_USERS = 'userlist.show-system-users';

  private store = new ElectronStore();

  public toggleShowPartialRealms() {
    const currentValue = this.store.get(this.KEY_SHOW_PARTIAL_REALMS, false);
    this.store.set(this.KEY_SHOW_PARTIAL_REALMS, !currentValue);
  }

  public toggleShowSystemRealms() {
    const currentValue = this.store.get(this.KEY_SHOW_SYSTEM_REALMS, false);
    this.store.set(this.KEY_SHOW_SYSTEM_REALMS, !currentValue);
  }

  public toggleShowSystemUsers() {
    const currentValue = this.store.get(this.KEY_SHOW_SYSTEM_USERS, false);
    this.store.set(this.KEY_SHOW_SYSTEM_USERS, !currentValue);
  }

  public shouldShowPartialRealms(): boolean {
    return this.store.get(this.KEY_SHOW_PARTIAL_REALMS, false);
  }

  public shouldShowSystemRealms(): boolean {
    return this.store.get(this.KEY_SHOW_SYSTEM_REALMS, false);
  }

  public shouldShowSystemUsers(): boolean {
    return this.store.get(this.KEY_SHOW_SYSTEM_USERS, false);
  }

  // Subclassing ElectronStore results in
  // `Class constructor ElectronStore cannot be invoked without 'new'`
  public set(key: string, value: any): void {
    this.store.set(key, value);
  }

  public get(key: string, defaultValue?: any): any {
    return this.store.get(key, defaultValue);
  }

  public onDidChange(
    key: string,
    callback: (newValue: any, oldValue: any) => void,
  ): void {
    this.store.onDidChange(key, callback);
  }

  public delete(key: string) {
    this.store.delete(key);
  }

  public has(key: string): boolean {
    return this.store.has(key);
  }
}

const store = new RealmStudioStore();

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

// TODO: Replace this with a Realm as soon as we don't need to CWD in the renderer.
// @see https://github.com/realm/realm-studio/blob/master/src/renderer.tsx#L15-L30

import ElectronStore from 'electron-store';

import { IWindowConstructorOptions } from './windows/Window';
import { WindowType } from './windows/WindowOptions';

type RemovalCallback = () => void;

class RealmStudioStore {
  public readonly KEY_SHOW_PARTIAL_REALMS = 'realmlist.show-partial-realms';
  public readonly KEY_SHOW_SYSTEM_REALMS = 'realmlist.show-system-realms';
  public readonly KEY_SHOW_SYSTEM_USERS = 'userlist.show-system-users';
  public readonly KEY_SHOW_SYSTEM_CLASSES = 'browser.show-system-classes';
  public readonly KEY_SHOW_INTERNAL_FEATURES = 'general.show-internal-features';
  public readonly KEY_WINDOW_OPTIONS = 'window-options';

  private store = new ElectronStore({ watch: true });

  public toggleShowPartialRealms() {
    const currentValue = this.shouldShowPartialRealms();
    this.store.set(this.KEY_SHOW_PARTIAL_REALMS, !currentValue);
  }

  public toggleShowSystemRealms() {
    const currentValue = this.shouldShowSystemRealms();
    this.store.set(this.KEY_SHOW_SYSTEM_REALMS, !currentValue);
  }

  public toggleShowSystemUsers() {
    const currentValue = this.shouldShowSystemUsers();
    this.store.set(this.KEY_SHOW_SYSTEM_USERS, !currentValue);
  }

  public toggleShowSystemClasses() {
    const currentValue = this.shouldShowSystemClasses();
    this.store.set(this.KEY_SHOW_SYSTEM_CLASSES, !currentValue);
  }

  public toggleShowInternalFeatures() {
    const currentValue = this.shouldShowInternalFeatures();
    this.store.set(this.KEY_SHOW_INTERNAL_FEATURES, !currentValue);
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

  public shouldShowSystemClasses(): boolean {
    return this.store.get(this.KEY_SHOW_SYSTEM_CLASSES, false);
  }

  public shouldShowInternalFeatures(): boolean {
    return this.store.get(this.KEY_SHOW_INTERNAL_FEATURES, false);
  }

  // Window option related methods
  public setWindowOptions(
    type: WindowType,
    options: IWindowConstructorOptions,
  ) {
    const key = `${this.KEY_WINDOW_OPTIONS}.${type}`;
    this.store.set(key, options);
  }

  // Window option related methods
  public getWindowOptions(type: WindowType): IWindowConstructorOptions {
    const key = `${this.KEY_WINDOW_OPTIONS}.${type}`;
    return this.store.get(key, {});
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
  ) {
    const removalCallback = this.store.onDidChange(key, callback);
    // The store actually returns a function that can be called to remove the listener
    return (removalCallback as any) as RemovalCallback;
  }

  public delete(key: string) {
    this.store.delete(key);
  }

  public has(key: string): boolean {
    return this.store.has(key);
  }
}

function createStore(): RealmStudioStore {
  // Export a store - if we're running in electron, null otherwise
  if (process.type) {
    return new RealmStudioStore();
  } else {
    // tslint:disable-next-line:no-console
    console.warn('Running outside electron, RealmStudioStore was not created');
    return null as any;
  }
}

export const store = createStore();

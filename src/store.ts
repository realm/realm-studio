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

const KEY_SHOW_SYSTEM_CLASSES = 'browser.show-system-classes';
const KEY_SHOW_INTERNAL_FEATURES = 'general.show-internal-features';
const KEY_WINDOW_OPTIONS = 'window-options';

type StudioStore = {
  [KEY_SHOW_SYSTEM_CLASSES]: boolean;
  [KEY_SHOW_INTERNAL_FEATURES]: boolean;
  [key: string]: unknown;
};

class RealmStudioStore {
  public readonly KEY_SHOW_SYSTEM_CLASSES = KEY_SHOW_SYSTEM_CLASSES;
  public readonly KEY_SHOW_INTERNAL_FEATURES = KEY_SHOW_INTERNAL_FEATURES;
  public readonly KEY_WINDOW_OPTIONS = KEY_WINDOW_OPTIONS;

  private store = new ElectronStore<StudioStore>({ watch: true });

  public toggleShowSystemClasses() {
    const currentValue = this.shouldShowSystemClasses();
    this.store.set(KEY_SHOW_SYSTEM_CLASSES, !currentValue);
  }

  public toggleShowInternalFeatures() {
    const currentValue = this.shouldShowInternalFeatures();
    this.store.set(KEY_SHOW_INTERNAL_FEATURES, !currentValue);
  }

  public shouldShowSystemClasses(): boolean {
    return this.store.get(KEY_SHOW_SYSTEM_CLASSES, false);
  }

  public shouldShowInternalFeatures(): boolean {
    return this.store.get(KEY_SHOW_INTERNAL_FEATURES, false);
  }

  // Window option related methods
  public setWindowOptions(
    type: WindowType,
    options: IWindowConstructorOptions,
  ) {
    const key = `${KEY_WINDOW_OPTIONS}.${type}`;
    this.store.set(key, options);
  }

  // Window option related methods
  public getWindowOptions(type: WindowType): IWindowConstructorOptions {
    const key = `${KEY_WINDOW_OPTIONS}.${type}`;
    const value = this.store.get(key, {});
    if (typeof value === 'object') {
      return value as IWindowConstructorOptions;
    } else {
      throw new Error(`Expected ${key} to be an object`);
    }
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

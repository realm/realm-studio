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

// Ensure that the window / UI code is not bundled into the main bundle.
if (process.type === 'browser') {
  throw new Error('This module should not be imported from the main process');
}

import * as sentry from '@sentry/electron';
import { remote } from 'electron';
import * as React from 'react';

import { mixpanel } from '../services/mixpanel';

import {
  generateMenu,
  IMenuGenerator,
  IMenuGeneratorProps,
} from './MenuGenerator';
import { SentryErrorBoundary } from './SentryErrorBoundary';
import { getWindowClass, InnerWindowComponent } from './Window';
import { getWindowOptions, WindowType } from './WindowOptions';

// TODO: Consider if we can have the window not show before a connection has been established.

interface ITrackedProperties {
  type: WindowType;
  [name: string]: string;
}

export abstract class WindowComponent extends React.Component
  implements IMenuGeneratorProps {
  protected menuGenerator?: IMenuGenerator;
  protected options = getWindowOptions();
  protected CurrentWindow = getWindowClass(this.options.type);
  protected CurrentWindowComponent?: InnerWindowComponent;

  public componentDidMount() {
    const trackedProperties: ITrackedProperties = {
      ...this.CurrentWindow.getTrackedProperties(this.options.props),
      type: this.options.type,
    };

    mixpanel.track('Window opened', trackedProperties);
    sentry.addBreadcrumb({
      category: 'ui.window',
      message: `Opened '${this.options.type}' window`,
    });
    // Generate the menu whenever the window gets focus
    window.addEventListener('focus', this.onFocussed);

    this.CurrentWindow.getComponent().then(CurrentWindowComponent => {
      this.CurrentWindowComponent = CurrentWindowComponent;
      this.forceUpdate();
    });
  }

  public componentWillUnmount() {
    window.removeEventListener('focus', this.onFocussed);
  }

  public render() {
    return this.CurrentWindowComponent ? (
      <this.CurrentWindowComponent
        {...this.options.props}
        updateMenu={this.updateMenu}
        ref={this.windowComponentRef}
      />
    ) : null;
  }

  public windowComponentRef = (element: any) => {
    if (element && typeof element.generateMenu === 'function') {
      // The window component has a method to generate a menu
      this.menuGenerator = element;
      // With the menuGenerator present - we can ask for the menu to be updated initially
      this.updateMenu();
    }
  };

  public updateMenu = () => {
    // Let's only generate menus of windows that are focused
    if (remote.getCurrentWindow().isFocused()) {
      // Generate and set the application
      const menu = generateMenu(this.menuGenerator, this.updateMenu);
      remote.Menu.setApplicationMenu(menu);
    }
  };

  private onFocussed = () => {
    this.updateMenu();
    sentry.configureScope(scope => {
      scope.setTag('window-type', this.options.type);
    });
    sentry.addBreadcrumb({
      category: 'ui.window',
      message: `Focussed '${this.options.type}' window`,
    });
  };
}

export const renderCurrentWindow = () => (
  <SentryErrorBoundary>
    <WindowComponent />
  </SentryErrorBoundary>
);

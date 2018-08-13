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
import * as querystring from 'querystring';
import * as React from 'react';

import { mixpanel } from '../services/mixpanel';

import {
  generateMenu,
  IMenuGenerator,
  IMenuGeneratorProps,
} from './MenuGenerator';
import { getWindowClass, InnerWindowComponent } from './Window';
import { WindowOptions, WindowType } from './WindowOptions';

// TODO: Consider if we can have the window not show before a connection has been established.

interface ITrackedProperties {
  type: WindowType;
  [name: string]: string;
}

const getWindowOptions = (): WindowOptions => {
  // Strip away the "?" of the location.search
  const queryString = location.search.substr(1);
  const query = querystring.parse<{ options?: string }>(queryString);
  if (query && typeof query.options === 'string') {
    return JSON.parse(query.options);
  } else {
    throw new Error('Expected "options" in the query parameters');
  }
};

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
    // Generate the menu now and whenever the window gets focus
    this.updateMenu();
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
    if (typeof element.generateMenu === 'function') {
      // The window component has a method to generate a menu
      this.menuGenerator = element;
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
    sentry.setTagsContext({
      'window-type': this.options.type,
    });
    sentry.addBreadcrumb({
      category: 'ui.window',
      message: `Focussed '${this.options.type}' window`,
    });
  };
}

export const renderCurrentWindow = () => <WindowComponent />;

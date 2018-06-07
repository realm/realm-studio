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

import { remote } from 'electron';
import * as querystring from 'querystring';
import * as React from 'react';
import * as mixpanel from '../services/mixpanel';

import {
  generateMenu,
  IMenuGenerator,
  IMenuGeneratorProps,
} from './MenuGenerator';
import { getWindowClass } from './Window';
import { WindowProps } from './WindowProps';
import { WindowType, WindowTypedProps } from './WindowTypedProps';

// TODO: Consider if we can have the window not show before a connection has been established.

interface ITrackedProperties {
  type: WindowType;
  [name: string]: string;
}

interface IWindowComponentProps {
  children: React.ReactChild;
}

const getCurrentWindowProps = (): WindowTypedProps => {
  // Strip away the "?" of the location.search
  const queryString = location.search.substr(1);
  const query = querystring.parse<{ props: string }>(queryString);
  if (query && typeof query.props === 'string') {
    return JSON.parse(query.props);
  } else {
    throw new Error('Expected "props" in the query parameters');
  }
};

export abstract class WindowComponent extends React.Component
  implements IMenuGeneratorProps {
  protected menuGenerators: IMenuGenerator[] = [];
  protected windowProps = getCurrentWindowProps();
  protected CurrentWindow = getWindowClass(this.windowProps);
  protected CurrentWindowComponent = this.CurrentWindow.getComponent();

  public componentDidMount() {
    const trackedProperties = {
      ...this.CurrentWindow.getTrackedProperties(this.windowProps),
      type: this.windowProps.type,
    };

    mixpanel.track('Window opened', trackedProperties);
    // Generate the menu now and whenever the window gets focus
    this.updateMenu();
    window.addEventListener('focus', this.updateMenu);
  }

  public componentWillUnmount() {
    window.removeEventListener('focus', this.updateMenu);
  }

  public render() {
    return (
      <this.CurrentWindowComponent
        {...this.windowProps}
        addMenuGenerator={this.addMenuGenerator}
        removeMenuGenerator={this.removeMenuGenerator}
        updateMenu={this.updateMenu}
      />
    );
  }

  public addMenuGenerator = (generator: IMenuGenerator) => {
    if (this.menuGenerators.indexOf(generator) === -1) {
      // Add the menu generator to the array
      this.menuGenerators.push(generator);
    }
  };

  public removeMenuGenerator = (generator: IMenuGenerator) => {
    const index = this.menuGenerators.indexOf(generator);
    if (index >= 0) {
      // Remove this menu generator from the array
      this.menuGenerators.splice(index, 1);
    }
  };

  public updateMenu = () => {
    // Let's only generate menus of windows that are focused
    if (remote.getCurrentWindow().isFocused()) {
      // Generate and set the application
      const menu = generateMenu(this.menuGenerators, this.updateMenu);
      remote.Menu.setApplicationMenu(menu);
    }
  };
}

export const renderCurrentWindow = () => <WindowComponent />;

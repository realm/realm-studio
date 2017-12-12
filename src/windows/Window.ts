import { remote } from 'electron';
import * as React from 'react';
import * as mixpanel from '../mixpanel';

import { ServerAdministrationContainer } from '../ui/server-administration/ServerAdministrationContainer';
import {
  generateMenu,
  IMenuGenerator,
  IMenuGeneratorProps,
} from './MenuGenerator';
import { IServerAdministrationOptions } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export abstract class Window<P, S> extends React.Component<P, S>
  implements IMenuGeneratorProps {
  protected menuGenerators: IMenuGenerator[] = [];

  public componentDidMount() {
    const trackedProperties = this.getTrackedProperties();
    mixpanel.track('Window opened', {
      ...trackedProperties,
      type: this.constructor.name,
    });
    // Generate the menu now and whenever the window gets focus
    this.generateMenu();
    window.addEventListener('focus', this.generateMenu);
  }

  public componentWillUnmount() {
    window.removeEventListener('focus', this.generateMenu);
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

  public generateMenu = () => {
    // Let's only generate menus of windows that are focused
    if (remote.getCurrentWindow().isFocused()) {
      // Generate and set the application
      const menu = generateMenu(this.menuGenerators);
      remote.Menu.setApplicationMenu(menu);
    }
  };

  protected getTrackedProperties(): { [n: string]: any } {
    return {};
  }
}

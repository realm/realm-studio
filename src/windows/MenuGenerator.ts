import { Menu, MenuItemConstructorOptions, remote } from 'electron';

import { main } from '../actions/main';
import { getDefaultMenuTemplate } from '../main/MainMenu';

// TODO: Throw if this is called from the main process

export interface IMenuGenerator {
  generateMenu(
    template: MenuItemConstructorOptions[],
  ): MenuItemConstructorOptions[];
}

export interface IMenuGeneratorProps {
  addMenuGenerator(generator: IMenuGenerator): void;
  removeMenuGenerator(generator: IMenuGenerator): void;
}

const isProduction = process.env.NODE_ENV === 'production';

export const generateMenu = (generators: IMenuGenerator[]) => {
  const defaultTemplate = getDefaultMenuTemplate();
  const template = generators.reduce((partialTemplate, generator) => {
    return generator.generateMenu(partialTemplate);
  }, defaultTemplate);
  return remote.Menu.buildFromTemplate(template);
};

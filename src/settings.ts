// TODO: Consider using a Realm instead
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

const settingsPath = path.resolve(
  electron.remote.app.getPath('userData'),
  'settings.json',
);

export interface ISettings {
  identity: string;
}

const DEFAULT_SETTINGS: ISettings = {
  identity: uuid(),
};

export const getSettings = (): Promise<ISettings> => {
  return fs.readJson(settingsPath).then(null, err => {
    return fs.writeJSON(settingsPath, DEFAULT_SETTINGS).then(() => {
      return DEFAULT_SETTINGS;
    });
  });
};

export const setSettings = (newSettings: Partial<ISettings>) => {
  getSettings().then(settings => {
    const updatedSettings = {
      ...settings,
      ...newSettings,
    };
    return fs.writeJSON(settingsPath, updatedSettings).then(() => {
      return updatedSettings;
    });
  });
};

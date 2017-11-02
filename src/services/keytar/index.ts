import * as electron from 'electron';
import * as keytar from 'keytar';

import * as ros from '../../services/ros';

const SERVICE_NAME = electron.remote.app.getName();

export const setCredentials = (credentials: ros.IServerCredentials) => {
  return keytar.setPassword(
    SERVICE_NAME,
    credentials.url,
    JSON.stringify(credentials),
  );
};

export const getCredentials = async (
  url: string | null,
): Promise<ros.IServerCredentials | null> => {
  if (!url) {
    return null;
  }
  const result = await keytar.getPassword(SERVICE_NAME, url);
  if (result) {
    return JSON.parse(result);
  } else {
    return null;
  }
};

export const unsetCredentials = async (url: string) => {
  return keytar.deletePassword(SERVICE_NAME, url);
};

import type electron from 'electron';
import type * as Remote from '@electron/remote';

export function getElectronOrRemote(): typeof electron | typeof Remote {
  if (process.type === 'renderer') {
    return getRemote();
  } else {
    return require('electron');
  }
}

export function getRemote(): typeof Remote {
  if (process.type === 'renderer') {
    // We need a require to prevent the remote module from being loaded
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@electron/remote');
  } else {
    throw new Error('Only loadable via a renderer process');
  }
}

import type electron from 'electron';
import type * as Remote from '@electron/remote';

export function getElectronOrRemote(): typeof electron | typeof Remote {
  if (process.type === 'renderer') {
    return getRemote();
  } else if (process.type === 'browser') {
    // We need a require to prevent the remote module from being loaded
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('electron');
  } else {
    throw new Error('getElectronOrRemote called outside of electron process');
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

import { main } from '../../actions/main';
import * as user from './user';

let promise: Promise<void> | null;

/**
 * Asks the user to authenticate again
 * @return A promise of a reauthenticated user
 */
export const reauthenticate = (message: string) => {
  // Check if we are already trying to reauthenticate the user
  if (!promise) {
    promise = main
      .showCloudAuthentication({ type: 'cloud-authentication', message }, true)
      .then(() => {
        promise = null;
      });
  }
  return promise;
};

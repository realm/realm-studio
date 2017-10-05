import { ipcRenderer } from 'electron';
import * as Realm from 'realm';

export { ActionReceiver } from './ActionReceiver';
export { ActionSender } from './ActionSender';

export interface IActionHandlers {
  [name: string]: (...args: any[]) => Promise<any> | void;
}

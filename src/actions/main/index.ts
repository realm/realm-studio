import { Receiver } from './Receiver';
import { Sender } from './Sender';

const sender = new Sender();

export { sender as main, Sender as MainSender, Receiver as MainReceiver };

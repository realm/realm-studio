import { DebugTransport } from './DebugTransport';
import { RendererTransport } from './RendererTransport';
import { Transport } from './Transport';

export { DebugTransport, Transport };
export { MainTransport } from './MainTransport';

export const getTransport = () => {
  if (process.versions.electron) {
    if (process.type === 'renderer') {
      return RendererTransport.getInstance();
    } else {
      // The main process transports are window specific
      return null;
    }
  } else {
    return DebugTransport.getInstance();
  }
};

export { LoadingOverlay } from './LoadingOverlay';

export type LoadingStatus = 'idle' | 'done' | 'failed' | 'in-progress';

export interface ILoadingProgress {
  status: LoadingStatus;
  message?: string;
  transferable?: number;
  transferred?: number;
}

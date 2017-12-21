export { LoadingOverlay } from './LoadingOverlay';

export type LoadingStatus = 'idle' | 'done' | 'failed' | 'in-progress';

export interface IRetryParams {
  onRetry: () => void;
  label: string;
}

export interface ILoadingProgress {
  message?: string;
  status: LoadingStatus;
  transferable?: number;
  transferred?: number;
  retry?: IRetryParams;
}

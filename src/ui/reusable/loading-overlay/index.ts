export { default as LoadingOverlay } from './LoadingOverlay';

export interface ILoadingProgress {
  done: boolean;
  failure?: string;
  transferable?: number;
  transferred?: number;
}

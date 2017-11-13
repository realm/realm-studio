export { LoadingOverlay } from './LoadingOverlay';

export interface ILoadingProgress {
  activity?: string;
  done: boolean;
  failure?: string;
  transferable?: number;
  transferred?: number;
}

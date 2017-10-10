import * as React from 'react';
import { Progress } from 'reactstrap';

import { LoadingDots } from '../loading-dots/LoadingDots';
import { ILoadingProgress } from './index';

import './LoadingOverlay.scss';

/**
 * An absolutly positioned loading overlay with three animated dots.
 * @param options.loading Is it loading?
 * @param options.fade Delay and fade in the overlay, prevent flickering when the load is fast.
 */
export const LoadingOverlay = ({
  loading,
  progress,
  fade = true,
}: {
  loading?: boolean;
  progress?: ILoadingProgress;
  fade?: boolean;
}) => {
  const classNames = ['LoadingOverlay'];
  if (!fade) {
    classNames.push('LoadingOverlay--no-fade');
  }
  // If a progress has been supplied, it overrides loading
  if (progress) {
    loading = !progress.done;
  }
  return loading ? (
    <div className={classNames.join(' ')}>
      <LoadingDots />
      {progress && (
        <Progress
          className="LoadingOverlay__Progress"
          value={progress.transferred}
          max={progress.transferable}
        />
      )}
    </div>
  ) : null;
};

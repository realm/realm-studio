import * as classNames from 'classnames';
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
  // If a progress has been supplied, it overrides loading
  const isVisible = progress ? !progress.done || progress.failure : loading;
  return isVisible ? (
    <div
      className={classNames('LoadingOverlay', {
        'LoadingOverlay--no-fade': !fade,
      })}
    >
      {(progress ? !progress.done : loading) ? <LoadingDots /> : null}
      {progress &&
        progress.transferable &&
        progress.transferred && (
          <Progress
            className="LoadingOverlay__Progress"
            value={progress.transferred}
            max={progress.transferable}
          />
        )}
      {progress && progress.failure ? (
        <section className="LoadingOverlay__Failure">
          <i
            className="LoadingOverlay__FailureIcon fa fa-exclamation-triangle"
            aria-hidden="true"
          />
          {progress.failure}
        </section>
      ) : null}
    </div>
  ) : null;
};

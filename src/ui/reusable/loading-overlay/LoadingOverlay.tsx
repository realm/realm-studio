import * as classNames from 'classnames';
import * as React from 'react';
import { Button, Progress } from 'reactstrap';

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
  const isVisible = progress ? progress.status !== 'done' : loading;
  // Show the progress bar if we know how far we've made it
  const showProgress =
    progress &&
    typeof progress.transferable === 'number' &&
    typeof progress.transferred === 'number';
  // Show the dots if making progress but being uncertain on how far
  const showDots = progress
    ? progress.status === 'in-progress' && !showProgress
    : loading;
  return isVisible ? (
    <div
      className={classNames('LoadingOverlay', {
        'LoadingOverlay--no-fade': !fade,
      })}
    >
      {progress && progress.status === 'failed' ? (
        <section className="LoadingOverlay__Failure">
          <i
            className="LoadingOverlay__FailureIcon fa fa-exclamation-circle"
            aria-hidden="true"
          />
        </section>
      ) : null}
      {progress && progress.message ? (
        <section className="LoadingOverlay__Message">
          {progress.message}
        </section>
      ) : null}
      {progress &&
        showProgress && (
          <Progress
            className="LoadingOverlay__Progress"
            value={progress.transferred}
            max={progress.transferable}
          />
        )}
      {showDots ? <LoadingDots /> : null}
      {progress && progress.retry ? (
        <Button
          className="LoadingOverlay__RetryButton"
          color="primary"
          onClick={progress.retry.onRetry}
        >
          {progress.retry.label}
        </Button>
      ) : null}
    </div>
  ) : null;
};

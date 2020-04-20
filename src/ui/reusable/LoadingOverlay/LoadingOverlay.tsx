////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import classNames from 'classnames';
import React from 'react';
import { Button, Progress } from 'reactstrap';

import { LoadingDots } from '../LoadingDots';
import { ILoadingProgress } from './index';

import { prettyBytes } from '../../../utils';
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
      <div className="LoadingOverlay__Content">
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
        {progress && showProgress && (
          <Progress
            className="LoadingOverlay__Progress"
            value={progress.transferred}
            max={progress.transferable}
          >
            {
              // tslint:disable-next-line: prettier
            `${prettyBytes(progress.transferred || 0)} / ${prettyBytes(progress.transferable || 0)}`}
          </Progress>
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
    </div>
  ) : null;
};

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

import { remote } from 'electron';
import classNames from 'classnames';
import React from 'react';
import { Carousel, CarouselIndicators, CarouselItem } from 'reactstrap';

import { marketing } from '../../../services/contentful';
import { ILoadingProgress, LoadingOverlay } from '../../reusable';

import { Status } from '.';
import { MessageSlide } from './MessageSlide';

import './MarketingPanel.scss';

const { app } = remote;

function getProgress(status: Status, onFetch: () => void): ILoadingProgress {
  if (status === 'loaded') {
    return { status: 'done' };
  } else if (status === 'loading') {
    return {
      message: `Welcome to\n${app.name}`,
      status: 'in-progress',
    };
  } else {
    return {
      status: 'failed',
      message: status.message,
      retry: {
        label: 'Try again',
        onRetry: onFetch,
      },
    };
  }
}

interface IMarketingPanelProps {
  activeIndex: number;
  className: string | undefined;
  goToIndex: (index: number) => void;
  isPreviewEnabled: boolean;
  messages: marketing.Message[];
  next: () => void;
  onFetch: () => void;
  onPreviewChange: React.ChangeEventHandler | undefined;
  onSlideClick: React.MouseEventHandler;
  previous: () => void;
  status: Status;
}

export const MarketingPanel = ({
  activeIndex,
  className,
  goToIndex,
  isPreviewEnabled,
  messages,
  next,
  onFetch,
  onPreviewChange,
  onSlideClick,
  previous,
  status,
}: IMarketingPanelProps) => (
  <div className={classNames('MarketingPanel', className)}>
    {status === 'loaded' ? (
      <Carousel
        className="MarketingPanel__Carousel"
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        <CarouselIndicators
          items={messages.map(message => ({ key: message.sys.id }))}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {messages.map(message => (
          <CarouselItem
            className="MarketingPanel__CarouselItem"
            key={message.sys.id}
          >
            <MessageSlide message={message} onClick={onSlideClick} />
          </CarouselItem>
        ))}
      </Carousel>
    ) : null}
    <LoadingOverlay progress={getProgress(status, onFetch)} />
    {onPreviewChange ? (
      <label className="MarketingPanel__PreviewToggle">
        <input
          type="checkbox"
          checked={isPreviewEnabled}
          onChange={onPreviewChange}
        />{' '}
        Show drafts
      </label>
    ) : null}
  </div>
);

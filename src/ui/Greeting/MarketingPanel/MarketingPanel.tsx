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

import * as classNames from 'classnames';
import * as React from 'react';
import { Carousel, CarouselIndicators, CarouselItem } from 'reactstrap';

import { inAppMarketing } from '../../../services/contentful';
import { LoadingOverlay } from '../../reusable';

import { MessageSlide } from './MessageSlide';

import './MarketingPanel.scss';

interface IMarketingPanelProps {
  activeIndex: number;
  className: string | undefined;
  goToIndex: (index: number) => void;
  isPreviewEnabled: boolean;
  loading: boolean;
  messages: inAppMarketing.Message[];
  next: () => void;
  onPreviewChange: React.ChangeEventHandler | undefined;
  onSlideClick: React.MouseEventHandler;
  previous: () => void;
}

export const MarketingPanel = ({
  activeIndex,
  className,
  goToIndex,
  isPreviewEnabled,
  loading,
  messages,
  next,
  onPreviewChange,
  onSlideClick,
  previous,
}: IMarketingPanelProps) => (
  <div className={classNames('MarketingPanel', className)}>
    {loading ? (
      <LoadingOverlay loading={loading} />
    ) : (
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
    )}
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

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

import { IMessage } from '../../../services/contentful/in-app-marketing-space';

import { MessageSlide } from './MessageSlide';

import './MarketingPanel.scss';

interface IMarketingPanelProps {
  activeIndex: number;
  className: string | undefined;
  goToIndex: (index: number) => void;
  messages: IMessage[];
  next: () => void;
  previous: () => void;
}

export const MarketingPanel = ({
  activeIndex,
  className,
  goToIndex,
  messages,
  next,
  previous,
}: IMarketingPanelProps) => (
  <Carousel
    activeIndex={activeIndex}
    className={classNames('MarketingPanel', className)}
    next={next}
    previous={previous}
  >
    <CarouselIndicators
      items={messages}
      activeIndex={activeIndex}
      onClickHandler={goToIndex}
    />
    {messages.map(message => (
      <CarouselItem className="MarketingPanel__CarouselItem" key={message.key}>
        <MessageSlide message={message} />
      </CarouselItem>
    ))}
  </Carousel>
);

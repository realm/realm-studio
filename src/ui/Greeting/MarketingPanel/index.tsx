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

import * as React from 'react';

import { MarketingPanel } from './MarketingPanel';

import { IMessage } from '../../../services/contentful/in-app-marketing-space';

interface IMarketingPanelContainerProps {
  className?: string;
}

interface IMarketingPanelContainerState {
  activeIndex: number;
  messages: IMessage[];
}

class MarketingPanelContainer extends React.Component<
  IMarketingPanelContainerProps,
  IMarketingPanelContainerState
> {
  public state = {
    activeIndex: 0,
    messages: [
      { content: 'Slide 1', key: 'slide-1' },
      { content: 'Slide 2', key: 'slide-2' },
      { content: 'Slide 3', key: 'slide-3' },
      { content: 'Slide 4', key: 'slide-4' },
    ],
  };

  public render() {
    return (
      <MarketingPanel
        activeIndex={this.state.activeIndex}
        className={this.props.className}
        goToIndex={this.goToIndex}
        next={this.next}
        previous={this.previous}
        messages={this.state.messages}
      />
    );
  }

  private next = () => {
    const { activeIndex, messages } = this.state;
    if (activeIndex >= messages.length - 1) {
      this.setState({ activeIndex: 0 });
    } else {
      this.setState({ activeIndex: activeIndex + 1 });
    }
  };

  private previous = () => {
    const { activeIndex, messages } = this.state;
    if (activeIndex <= 0) {
      this.setState({ activeIndex: messages.length - 1 });
    } else {
      this.setState({ activeIndex: activeIndex - 1 });
    }
  };

  private goToIndex = (index: number) => {
    this.setState({ activeIndex: index });
  };
}

export { MarketingPanelContainer as MarketingPanel };

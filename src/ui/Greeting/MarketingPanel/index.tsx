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

import { main } from '../../../actions/main';
import { inAppMarketing } from '../../../services/contentful';

const previewAvailable =
  process.env.REALM_STUDIO_INTERNAL_FEATURES === 'true' ||
  process.env.NODE_ENV === 'development';

interface IMarketingPanelContainerProps {
  className?: string;
}

interface IMarketingPanelContainerState {
  activeIndex: number;
  messages: inAppMarketing.Message[];
  loading: boolean;
  isPreviewEnabled: boolean;
}

class MarketingPanelContainer extends React.PureComponent<
  IMarketingPanelContainerProps,
  IMarketingPanelContainerState
> {
  public state = {
    activeIndex: 0,
    messages: [],
    loading: true,
    isPreviewEnabled: previewAvailable,
  };

  public constructor(props: IMarketingPanelContainerProps) {
    super(props);
    // Log to the console if an error occurs - we have no better way of handling that
    // tslint:disable-next-line:no-console
    this.fetchMessages().then(null, err => console.error(err));
  }

  public render() {
    return (
      <MarketingPanel
        activeIndex={this.state.activeIndex}
        className={this.props.className}
        goToIndex={this.goToIndex}
        isPreviewEnabled={this.state.isPreviewEnabled}
        loading={this.state.loading}
        messages={this.state.messages}
        next={this.next}
        onSlideClick={this.onSlideClick}
        previous={this.previous}
        onPreviewChange={previewAvailable ? this.onPreviewChange : undefined}
      />
    );
  }

  private async fetchMessages() {
    // Choose the correct client
    const client = this.state.isPreviewEnabled
      ? inAppMarketing.clients.preview
      : inAppMarketing.clients.delivery;
    // Indicate that the messages are loading, resetting the active index
    this.setState({ activeIndex: 0, loading: true });
    // Fetch the messages
    const { items: messages } = await client.getEntries<
      inAppMarketing.IMessage
    >({
      content_type: 'message',
    });
    this.setState({ messages, loading: false });
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

  private onSlideClick: React.MouseEventHandler = e => {
    const element = e.target as HTMLElement;
    // Check if the element clicked has a call to action
    const { callToActionSlug } = element.dataset;
    if (callToActionSlug === 'sign-up-for-realm-cloud') {
      main.showCloudAuthentication({ mode: 'sign-up' });
    } else if (callToActionSlug) {
      // tslint:disable-next-line:no-console
      console.warn(
        `Asked to perform an unsupported call to action: ${callToActionSlug}`,
      );
    }
  };

  private onPreviewChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({ isPreviewEnabled: e.currentTarget.checked }, () => {
      // Refetch messages
      // tslint:disable-next-line:no-console
      this.fetchMessages().then(null, err => console.error(err));
    });
  };
}

export { MarketingPanelContainer as MarketingPanel };

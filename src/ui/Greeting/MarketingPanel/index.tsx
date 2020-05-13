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
import moment from 'moment';
import React from 'react';

import { MarketingPanel } from './MarketingPanel';

import { marketing } from '../../../services/contentful';

const previewAvailable =
  process.env.REALM_STUDIO_INTERNAL_FEATURES === 'true' ||
  process.env.NODE_ENV === 'development';

export type Status = 'loading' | 'loaded' | Error;

interface IMarketingPanelContainerProps {
  className?: string;
}

interface IMarketingPanelContainerState {
  status: Status;
  isPreviewEnabled: boolean;
  activeIndex: number;
  messages: marketing.Message[];
}

class MarketingPanelContainer extends React.PureComponent<
  IMarketingPanelContainerProps,
  IMarketingPanelContainerState
> {
  public state: IMarketingPanelContainerState = {
    activeIndex: 0,
    status: 'loading',
    isPreviewEnabled: previewAvailable,
    messages: [],
  };

  public constructor(props: IMarketingPanelContainerProps) {
    super(props);
    this.onFetch();
  }

  public componentDidCatch(err: Error) {
    this.setState({ status: err });
  }

  public render() {
    return (
      <MarketingPanel
        activeIndex={this.state.activeIndex}
        className={this.props.className}
        goToIndex={this.goToIndex}
        isPreviewEnabled={this.state.isPreviewEnabled}
        messages={this.state.messages}
        next={this.next}
        onFetch={this.onFetch}
        onPreviewChange={previewAvailable ? this.onPreviewChange : undefined}
        onSlideClick={this.onSlideClick}
        previous={this.previous}
        status={this.state.status}
      />
    );
  }

  private async fetchMessages() {
    // Choose the correct client
    const client = this.state.isPreviewEnabled
      ? marketing.clients.preview
      : marketing.clients.delivery;
    // Indicate that the messages are loading, resetting the active index
    this.setState({ activeIndex: 0, status: 'loading', messages: [] });
    // Fetch the messages
    const { items: channels } = await client.getEntries<marketing.IChannel>({
      content_type: 'channel',
      'fields.slug': 'realm-studio',
      include: 2, // Include links to entries at depth 2 to include embedded "call to action"
    });
    if (channels.length === 1) {
      const { messages } = channels[0].fields;
      const filteredMessages = messages
        .filter(message => {
          // Display only messages with fields (will be missing for inaccessible drafts)
          return message.fields;
        })
        .filter(message => {
          // Check that the published datetimes are either missing or satifying the current datetime
          // We do this client-side because Contentful doesn't support complex queries
          const { publishedFrom, publishedUntil } = message.fields;
          const publishedFromAccepted =
            !publishedFrom || moment(publishedFrom).isBefore();
          const publishedUntilAccepted =
            !publishedUntil || moment(publishedUntil).isAfter();
          return publishedFromAccepted && publishedUntilAccepted;
        })
        .slice(0, 5); // Show only the first 5 messages
      this.setState({ messages: filteredMessages, status: 'loaded' });
    } else {
      const err = new Error('Expected exactly one "realm-studio" channel');
      this.setState({ status: err });
    }
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
    if (callToActionSlug === 'mongodb-realm-keep-me-updated') {
      const url = 'https://www.mongodb.com/realm/subscribe';
      remote.shell.openExternal(url);
    } else if (callToActionSlug) {
      // tslint:disable-next-line:no-console
      console.warn(
        `Asked to perform an unsupported call to action: ${callToActionSlug}`,
      );
    }
  };

  private onPreviewChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({ isPreviewEnabled: e.currentTarget.checked }, this.onFetch);
  };

  private onFetch = () => {
    this.fetchMessages().then(null, (err: Error) =>
      this.setState({ status: err }),
    );
  };
}

export { MarketingPanelContainer as MarketingPanel };

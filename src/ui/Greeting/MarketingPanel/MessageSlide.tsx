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

import {
  documentToHtmlString,
  NodeRenderer,
} from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import * as classNames from 'classnames';
import { Asset, Entry } from 'contentful';
import * as React from 'react';

import { inAppMarketing } from '../../../services/contentful';

interface IMessageSlideProps {
  message: inAppMarketing.Message;
  onClick: React.MouseEventHandler;
}

function getAssetUrl(asset: Asset) {
  return `https:${asset.fields.file.url}`;
}

function generateBackgroundProperty(asset: Asset | undefined) {
  return asset ? `url(${getAssetUrl(asset)}?h=500)` : undefined;
}

const renderNode: { [key: string]: NodeRenderer } = {
  // Injecting a class onto images
  [BLOCKS.EMBEDDED_ASSET]: node => {
    if (
      node.data &&
      node.data.target &&
      node.data.target.sys &&
      node.data.target.sys.type === 'Asset'
    ) {
      const asset = node.data.target as Asset;
      const attributes = [
        'class="MarketingPanel__EmbeddedAsset"',
        `src="${getAssetUrl(asset)}"`,
        `alt="${asset.fields.title}"`,
      ];
      return `<img ${attributes.join(' ')}>`;
    } else {
      // tslint:disable-next-line:no-console
      console.warn('Asked to render an unsupported embedded asset');
      return '';
    }
  },
  // Injecting a target into links
  [INLINES.HYPERLINK]: (node, next) => {
    if (node.data && node.data.uri) {
      const content = next(node.content);
      return `<a href="${node.data.uri}" target="__blank">${content}</a>`;
    } else {
      // tslint:disable-next-line:no-console
      console.warn('Asked to render an unsupported hyperlink');
      return '';
    }
  },
  // Render inline call to action
  [INLINES.EMBEDDED_ENTRY]: node => {
    if (node && node.data && node.data.target) {
      const entry = node.data.target as Entry<any>;
      if (entry.sys.contentType.sys.id === 'callToAction') {
        const { label, slug } = entry.fields;
        const attributes = [
          'class="btn btn-primary btn-sm"',
          // Super hacky way of communicating a click on a call to action
          `data-call-to-action-slug="${slug}"`,
        ];
        return `<button ${attributes.join(' ')}>${label}</button>`;
      } else {
        // tslint:disable-next-line:no-console
        console.warn(
          `Asked to render an unsupported embedded entry of type ${
            entry.sys.contentType.sys.id
          }`,
        );
        return '';
      }
    } else {
      // tslint:disable-next-line:no-console
      console.warn('Asked to render an unsupported embedded entry');
      return '';
    }
  },
};

export const MessageSlide = ({
  message: {
    fields: { backgroundMedia, verticalAlignment, textAlignment, content },
  },
  onClick,
}: IMessageSlideProps) => (
  <div
    className="MarketingPanel__MessageSlide"
    style={{
      backgroundImage: generateBackgroundProperty(backgroundMedia),
    }}
  >
    <div
      className={classNames(
        'MarketingPanel__MessageContent',
        `MarketingPanel__MessageContent--${verticalAlignment || 'middle'}`,
        `MarketingPanel__MessageContent--${textAlignment || 'justify'}`,
      )}
      onClick={onClick}
      dangerouslySetInnerHTML={{
        __html: documentToHtmlString(content, { renderNode }),
      }}
    />
  </div>
);

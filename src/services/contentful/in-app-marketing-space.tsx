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

import { Document } from '@contentful/rich-text-types';
import * as Contentful from 'contentful';

const SPACE_ID = 'l4znbhf42s3c';
const DELIVERY_TOKEN =
  'bf81fd50a12d4d631553b2641e0e3deddacc3b0c370bebd0f163886bc10bdda0';
const PREVIEW_TOKEN =
  'f2bbfb941b4c25123d3fc48770e7391fb23c903a9c307d0fbbff1dcaabd9da74';

/*
import * as React from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

function getUrl(accessToken: string) {
  return `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}?access_token=${accessToken}`;
}

const clients = {
  delivery: new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: getUrl(DELIVERY_TOKEN),
    }),
  }),
  preview: new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: getUrl(PREVIEW_TOKEN),
    }),
  }),
};

interface IWithContentfulProps {
  children: React.ReactNode;
  mode: 'delivery' | 'preview';
}

export const WithContentful = ({
  children,
  mode = 'delivery',
}: IWithContentfulProps) => (
  <ApolloProvider client={clients[mode]}>{children}</ApolloProvider>
);
*/

export const clients = {
  delivery: Contentful.createClient({
    space: SPACE_ID,
    accessToken: DELIVERY_TOKEN,
  }),
  preview: Contentful.createClient({
    host: 'preview.contentful.com',
    space: SPACE_ID,
    accessToken: PREVIEW_TOKEN,
  }),
};

export interface IMessage {
  backgroundMedia?: Contentful.Asset;
  content: Document;
  key: string;
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  textAlignment?: 'left' | 'justify' | 'center';
}

export interface ICallToAction {
  slug: string;
  label: string;
}

export type CallToAction = Contentful.Entry<ICallToAction>;
export type Message = Contentful.Entry<IMessage>;

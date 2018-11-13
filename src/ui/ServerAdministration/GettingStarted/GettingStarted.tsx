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
import { Button, Input } from 'reactstrap';

import './GettingStarted.scss';

interface IGettingStartedProps {
  onShowTutorial: (name: 'ios' | 'android' | 'react-native') => void;
  serverUrl: string;
}

export const GettingStarted = ({
  onShowTutorial,
  serverUrl,
}: IGettingStartedProps) => (
  <div className="GettingStarted">
    <div className="GettingStarted__Instructions">
      <h2 className="GettingStarted__Heading">Your instance is ready</h2>
      <Input
        className="GettingStarted__Input"
        value={serverUrl}
        onChange={() => {
          /* Do nothing ... */
        }}
        onFocus={e => {
          e.currentTarget.select();
        }}
      />
      <p>
        Realm Cloud gives your Realm Database a syncing object server in the
        cloud. Although this instance link is ready to use in any project, we
        recommend starting with our demo apps documented below.
      </p>
      <h3 className="GettingStarted__Heading">Build a demo project</h3>
      <p>
        Our ToDo demo app is the best way to try Realm Cloud. You can quickly
        try it out with our step-by-step instructions — just copy your app link
        from above, and choose an OS:
      </p>
      <section className="GettingStarted__Tutorial">
        <Button
          className="GettingStarted__Button"
          onClick={() => {
            onShowTutorial('ios');
          }}
        >
          Start with iOS
        </Button>
        <Button
          className="GettingStarted__Button"
          onClick={() => {
            onShowTutorial('android');
          }}
        >
          Start with Android
        </Button>
        <Button
          className="GettingStarted__Button"
          onClick={() => {
            onShowTutorial('react-native');
          }}
        >
          Start with React Native
        </Button>
      </section>
      If you have any issues, questions or comments visit our{' '}
      <a target="__blank" href="https://forums.realm.io/c/realm-cloud">
        Forums
      </a>.
    </div>
    <div className="GettingStarted__Image" />
  </div>
);

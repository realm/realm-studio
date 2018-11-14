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
import { Button } from 'reactstrap';

import { Mode } from '..';

import './IntroductionOverlay.scss';

interface IIntroductionOverlay {
  onModeChange: (mode: Mode) => void;
}

export const IntroductionOverlay = ({ onModeChange }: IIntroductionOverlay) => (
  <div className="IntroductionOverlay">
    <p>
      Cloud deployment in minutes for seamless edge-to-cloud data
      synchronization.
    </p>
    <div className="IntroductionOverlay__Controls">
      <Button
        className="IntroductionOverlay__Button"
        color="primary"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          onModeChange('sign-up');
        }}
      >
        Sign up
      </Button>
      <Button
        className="IntroductionOverlay__Button"
        color="secondary"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          onModeChange('log-in');
        }}
      >
        I already have an account
      </Button>
    </div>
    <p className="IntroductionOverlay__Link">
      Read more on{' '}
      <a href="https://cloud.realm.io/" target="_blank">
        {/* @see https://github.com/prettier/prettier/issues/2347 */}
        {'https://cloud.realm.io/'}
      </a>
    </p>
  </div>
);

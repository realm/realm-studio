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

import { Platform } from '.';
import nodeJsLogo from '../../../../static/svgs/node-js-logo.svg';
import xamarinLogo from '../../../../static/svgs/xamarin-logo.svg';
import { PlatformOverlay } from './PlatformOverlay';

import './Dashboard.scss';

const displayPlatform = (platform: Platform) => {
  if (platform === 'android') {
    return 'Android (Java)';
  } else if (platform === 'apple') {
    return 'iOS / macOS (Swift / Objective C)';
  } else if (platform === 'javascript') {
    return 'React Native / Node.js (JavaScript)';
  } else if (platform === 'xamarin') {
    return 'Xamarin (.NET)';
  }
};

interface IDashboardProps {
  hoveringPlatform?: Platform;
  isCloudTenant: boolean;
  onDeselectPlatform: () => void;
  onMouseEnterPlatform: (platform: Platform) => void;
  onMouseLeavePlatform: () => void;
  onSelectPlatform: (platform: Platform) => void;
  selectedPlatform?: Platform;
}

export const Dashboard = ({
  hoveringPlatform,
  isCloudTenant,
  onDeselectPlatform,
  onMouseEnterPlatform,
  onMouseLeavePlatform,
  onSelectPlatform,
  selectedPlatform,
}: IDashboardProps) => (
  <section className="Dashboard">
    <h2 className="Dashboard__Heading">
      Welcome to your very own Realm Cloud server
    </h2>
    <div className="Dashboard__Separator">
      Click a platform below to connect immediately
    </div>
    <section className="Dashboard__Platforms">
      <section className="Dashboard__PlatformIcons">
        <div
          className="Dashboard__Platform"
          onMouseEnter={() => onMouseEnterPlatform('android')}
          onMouseLeave={() => onMouseLeavePlatform()}
          onClick={() => onSelectPlatform('android')}
        >
          <i className="fa fa-android" />
        </div>
        <div
          className="Dashboard__Platform"
          onMouseEnter={() => onMouseEnterPlatform('apple')}
          onMouseLeave={() => onMouseLeavePlatform()}
          onClick={() => onSelectPlatform('apple')}
        >
          <i className="fa fa-apple" />
        </div>
        <div
          className="Dashboard__Platform"
          onMouseEnter={() => onMouseEnterPlatform('javascript')}
          onMouseLeave={() => onMouseLeavePlatform()}
          onClick={() => onSelectPlatform('javascript')}
        >
          <svg
            className="Dashboard__Platform__JavascriptLogo"
            viewBox={nodeJsLogo.viewBox}
          >
            <use xlinkHref={`#${nodeJsLogo.id}`} />
          </svg>
        </div>
        <div
          className="Dashboard__Platform"
          onMouseEnter={() => onMouseEnterPlatform('xamarin')}
          onMouseLeave={() => onMouseLeavePlatform()}
          onClick={() => onSelectPlatform('xamarin')}
        >
          <svg
            className="Dashboard__Platform__XamarinLogo"
            viewBox={xamarinLogo.viewBox}
          >
            <use xlinkHref={`#${xamarinLogo.id}`} />
          </svg>
        </div>
      </section>
      <p className="Dashboard__PlatformTip">
        {hoveringPlatform ? displayPlatform(hoveringPlatform) : null}
      </p>
    </section>
    {selectedPlatform ? (
      <PlatformOverlay
        onClose={onDeselectPlatform}
        platform={selectedPlatform}
      />
    ) : null}
  </section>
);

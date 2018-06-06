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

import * as classnames from 'classnames';
import * as React from 'react';

import './LoadingDots.scss';

export const LoadingDots = ({ className }: { className?: string }) => (
  <svg
    className={classnames('LoadingDots', className)}
    width="60px"
    height="20px"
    viewBox="-5 -5 60 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <circle
        fill="currentColor"
        className="LoadingDots__dot-1"
        cx="5"
        cy="5"
        r="5"
      />
      <circle
        fill="currentColor"
        className="LoadingDots__dot-2"
        cx="25"
        cy="5"
        r="5"
      />
      <circle
        fill="currentColor"
        className="LoadingDots__dot-3"
        cx="45"
        cy="5"
        r="5"
      />
    </g>
  </svg>
);

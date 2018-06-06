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

import { LogLevel } from '.';

export interface ILevelIconProps {
  className?: string;
  level: LogLevel;
}

export const LevelIcon = ({ className, level }: ILevelIconProps) => {
  if (level === LogLevel.fatal) {
    return <i className={classNames('fa fa-fire', className)} />;
  } else if (level === LogLevel.error) {
    return <i className={classNames('fa fa-times-circle', className)} />;
  } else if (level === LogLevel.warn) {
    return <i className={classNames('fa fa-exclamation-circle', className)} />;
  } else if (level === LogLevel.info) {
    return <i className={classNames('fa fa-info-circle', className)} />;
  } else if (level === LogLevel.detail) {
    return <i className={classNames('fa fa-circle', className)} />;
  } else if (level === LogLevel.debug) {
    return <i className={classNames('fa fa-circle-o', className)} />;
  } else if (level === LogLevel.trace) {
    return <i className={classNames('fa fa-long-arrow-right', className)} />;
  } else {
    return null;
  }
};

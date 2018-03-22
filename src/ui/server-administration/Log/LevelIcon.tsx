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

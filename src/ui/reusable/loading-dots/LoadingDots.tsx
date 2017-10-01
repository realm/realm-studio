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

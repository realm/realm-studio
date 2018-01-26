import * as classNames from 'classnames';
import * as React from 'react';
import { Button } from 'reactstrap';

import { Mode } from '..';

import './WaitlistOverlay.scss';

interface IWaitlistOverlay {
  onModeChange: (mode: Mode) => void;
}

export const WaitlistOverlay = ({ onModeChange }: IWaitlistOverlay) => (
  <div className="WaitlistOverlay">
    <p>
      Keep your eyes out for an email with further instructions. We will send it
      once your account is approved for the beta.
    </p>
    <p className="WaitlistOverlay__Link">
      Read more on{' '}
      <a href="https://cloud.realm.io/" target="_blank">
        {/* @see https://github.com/prettier/prettier/issues/2347 */}
        {'https://cloud.realm.io/'}
      </a>
    </p>
  </div>
);

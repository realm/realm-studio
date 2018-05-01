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
        onClick={e => {
          e.preventDefault();
          onModeChange('sign-up');
        }}
      >
        Sign up
      </Button>
      <Button
        className="IntroductionOverlay__Button"
        color="secondary"
        onClick={e => {
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

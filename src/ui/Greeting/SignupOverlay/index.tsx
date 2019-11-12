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

import electron from 'electron';
import React from 'react';
import { mixpanel } from '../../../services/mixpanel';

import { SignupOverlay } from './SignupOverlay';

const HAS_SIGNED_UP_STORAGE_KEY = 'has-signed-up';

function determineVisibility() {
  return !(
    mixpanel.get_property('has_signed_up') ||
    localStorage.getItem(HAS_SIGNED_UP_STORAGE_KEY) === 'true' ||
    process.env.REALM_STUDIO_SKIP_SIGNUP
  );
}

interface ISignupOverlayContainerState {
  email: string;
  newsletter: boolean;
  isVisible: boolean;
}

class SignupOverlayContainer extends React.Component<
  {},
  ISignupOverlayContainerState
> {
  public state: ISignupOverlayContainerState = {
    email: '',
    newsletter: false,
    isVisible: determineVisibility(),
  };

  public render() {
    return <SignupOverlay {...this.state} {...this} />;
  }

  public onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: e.target.value,
    });
  };

  public onNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newsletter: e.target.checked,
    });
  };

  public onSignup = () => {
    mixpanel.people.set(
      {
        $browser: 'Realm Studio',
        $browser_version: electron.remote.app.getVersion() || 'unknown',
        $email: this.state.email,
        newsletter: this.state.newsletter,
        signupDate: new Date(),
      },
      () => {
        localStorage.setItem(HAS_SIGNED_UP_STORAGE_KEY, 'true');
        this.setState({
          isVisible: false,
        });
      },
    );
  };

  public onSkip = () => {
    this.setState({
      isVisible: false,
    });
  };
}

export { SignupOverlayContainer as SignupOverlay };

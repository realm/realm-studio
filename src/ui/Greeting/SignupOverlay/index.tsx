import * as electron from 'electron';
import * as React from 'react';
import * as mixpanel from '../../../services/mixpanel';

import { SignupOverlay } from './SignupOverlay';

const HAS_SIGNED_UP_STORAGE_KEY = 'has-signed-up';

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
    isVisible: !(
      mixpanel.get_property('has_signed_up') ||
      localStorage.getItem(HAS_SIGNED_UP_STORAGE_KEY) === 'true'
    ),
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

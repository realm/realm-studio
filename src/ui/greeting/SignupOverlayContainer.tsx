import * as electron from 'electron';
import * as React from 'react';
import * as mixpanel from '../../services/mixpanel';

import { SignupOverlay } from './SignupOverlay';

export class SignupOverlayContainer extends React.Component<
  {},
  {
    email: string;
    newsletter: boolean;
    isVisible: boolean;
  }
> {
  constructor() {
    super();
    const hasSignedUp = mixpanel.get_property('has_signed_up');
    this.state = {
      email: '',
      newsletter: false,
      isVisible: !hasSignedUp,
    };
  }

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

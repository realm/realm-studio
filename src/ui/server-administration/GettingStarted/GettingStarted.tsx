import * as React from 'react';
import { Button, Input } from 'reactstrap';

import './GettingStarted.scss';

interface IGettingStartedProps {
  onShowTutorial: (name: 'ios' | 'android' | 'cloud') => void;
  serverUrl: string;
}

export const GettingStarted = ({
  onShowTutorial,
  serverUrl,
}: IGettingStartedProps) => (
  <div className="GettingStarted">
    <div className="GettingStarted__Instructions">
      <h2 className="GettingStarted__Heading">Your instance is ready</h2>
      <Input
        className="GettingStarted__Input"
        value={serverUrl}
        onFocus={e => {
          e.currentTarget.select();
        }}
      />
      <p>
        Realm Cloud gives your Realm Database a syncing object server in the
        cloud. Although this instance link is ready to use in any project, we
        recommend starting with our demo apps documented below.
      </p>
      <h3 className="GettingStarted__Heading">Build a demo project</h3>
      <p>
        Our Tasks demo app is the best way to try Realm Cloud. You can quickly
        try it out with our step-by-step instructions — just copy your app link
        from above, and choose an OS:
      </p>
      <section className="GettingStarted__Tutorial">
        <Button
          className="GettingStarted__Button"
          onClick={() => {
            onShowTutorial('ios');
          }}
        >
          Start with iOS
        </Button>
        <Button
          className="GettingStarted__Button"
          onClick={() => {
            onShowTutorial('android');
          }}
        >
          Start with Android
        </Button>
        <Button
          className="GettingStarted__Button"
          onClick={() => {
            onShowTutorial('cloud');
          }}
        >
          Start with Node.js
        </Button>
      </section>
      If you have any issues, questions or comments visit our{' '}
      <a target="__blank" href="https://forums.realm.io/c/realm-cloud">
        Beta Forums
      </a>.
    </div>
    <div className="GettingStarted__Image" />
  </div>
);

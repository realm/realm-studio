import * as React from 'react';
import { Button, Input, Label } from 'reactstrap';

import { AuthenticationFooter } from './AuthenticationFooter';
import { TenantsContainer } from './TenantsContainer';

import './CloudAdministration.scss';

export const CloudAdministration = ({
  hasSentMessage,
  hasToken,
  message,
  onAuthenticate,
  onMessageChange,
  onSendMessage,
}: {
  hasSentMessage: boolean;
  hasToken: boolean;
  message: string;
  onAuthenticate: () => void;
  onMessageChange: (e: React.ChangeEvent<any>) => void;
  onSendMessage: () => void;
}) =>
  hasToken ? (
    <div className="CloudAdministration">
      <TenantsContainer />
    </div>
  ) : (
    <div className="CloudAdministration">
      <div className="CloudAdministration__Background">
        <i
          className="CloudAdministration__Cloud fa fa-cloud"
          aria-hidden="true"
        />
      </div>
      {hasSentMessage ? (
        <div className="CloudAdministration__Content">
          <div className="CloudAdministration__Teaser">
            <h3 className="CloudAdministration__Title">Thank you!</h3>
            <p className="CloudAdministration__SubTitle">
              Please check back here, to see the progress!
            </p>
          </div>
          <AuthenticationFooter
            hasSentMessage={hasSentMessage}
            onAuthenticate={onAuthenticate}
            onSendMessage={onSendMessage}
          />
        </div>
      ) : (
        <div className="CloudAdministration__Content">
          <div className="CloudAdministration__Teaser">
            <h3 className="CloudAdministration__Title">
              Realm Cloud is on the rise!
            </h3>
            <p>
              We're making it even easier to start and administer your Realm
              Object Server! If you want to be among the first that gets access,
              fill out the form and sign up. If you already have access,
              authenticate with your GitHub account!
            </p>
            <p>
              Please write us a message and let us know what you would expect of
              the Realm Cloud.
            </p>
          </div>
          <Input
            className="CloudAdministration__Feedback"
            type="textarea"
            placeholder="I want to use it for ..."
            value={message}
            onChange={onMessageChange}
          />
          <AuthenticationFooter
            hasSentMessage={hasSentMessage}
            onAuthenticate={onAuthenticate}
            onSendMessage={onSendMessage}
          />
        </div>
      )}
    </div>
  );

import * as React from 'react';
import { Button } from 'reactstrap';

export const AuthenticationFooter = ({
  hasSentMessage,
  onAuthenticate,
  onSendMessage,
}: {
  hasSentMessage: boolean;
  onAuthenticate: () => void;
  onSendMessage: () => void;
}) => (
  <div className="CloudAdministration__AuthenticationFooter">
    {hasSentMessage ? (
      <p>If you have been granted access to the Realm Cloud</p>
    ) : (
      <Button onClick={onSendMessage}>Sign up for Realm Cloud</Button>
    )}
    &nbsp;
    <Button onClick={onAuthenticate} color="primary">
      <i className="fa fa-github" aria-hidden="true" />
      &nbsp;Authenticate with GitHub
    </Button>
  </div>
);

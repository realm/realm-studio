import * as React from 'react';
import { Button } from 'reactstrap';

import { AuthenticationMethod } from './AuthenticationForm';

export const AuthenticationMethodSelector = ({
  method,
  onMethodChanged,
}: {
  method: AuthenticationMethod;
  onMethodChanged: (method: AuthenticationMethod) => void;
}) => (
  <div className="ConnectToServer__AuthenticationMethodSelector">
    <Button
      className="ConnectToServer__AuthenticationMethodSelector__Btn"
      size="sm"
      active={method === AuthenticationMethod.usernamePassword}
      onClick={e => {
        e.preventDefault();
        onMethodChanged(AuthenticationMethod.usernamePassword);
      }}
    >
      Username / password
    </Button>
    <Button
      className="ConnectToServer__AuthenticationMethodSelector__Btn"
      size="sm"
      active={method === AuthenticationMethod.adminToken}
      onClick={e => {
        e.preventDefault();
        onMethodChanged(AuthenticationMethod.adminToken);
      }}
    >
      Admin token
    </Button>
  </div>
);

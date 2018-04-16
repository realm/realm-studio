import * as React from 'react';
import { Button } from 'reactstrap';

import { AuthenticationMethod } from './AuthenticationForm';

export type MethodChangedHandler = (method: AuthenticationMethod) => void;

const AuthenticationMethodButton = ({
  activeMethod,
  children,
  method,
  onMethodChanged,
}: {
  activeMethod: AuthenticationMethod;
  children: React.ReactNode;
  method: AuthenticationMethod;
  onMethodChanged: MethodChangedHandler;
}) => (
  <Button
    className="ConnectToServer__AuthenticationMethodSelector__Btn"
    size="sm"
    color={method === activeMethod ? 'primary' : 'secondary'}
    onClick={e => {
      e.preventDefault();
      onMethodChanged(method);
    }}
  >
    {children}
  </Button>
);

export const AuthenticationMethodSelector = ({
  method,
  onMethodChanged,
}: {
  method: AuthenticationMethod;
  onMethodChanged: MethodChangedHandler;
}) => (
  <div className="ConnectToServer__AuthenticationMethodSelector">
    <AuthenticationMethodButton
      activeMethod={method}
      method={AuthenticationMethod.usernamePassword}
      onMethodChanged={onMethodChanged}
    >
      Username / password
    </AuthenticationMethodButton>
    <AuthenticationMethodButton
      activeMethod={method}
      method={AuthenticationMethod.adminToken}
      onMethodChanged={onMethodChanged}
    >
      Admin token
    </AuthenticationMethodButton>
    <AuthenticationMethodButton
      activeMethod={method}
      method={AuthenticationMethod.other}
      onMethodChanged={onMethodChanged}
    >
      Other
    </AuthenticationMethodButton>
  </div>
);

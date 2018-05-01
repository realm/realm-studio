import * as React from 'react';

import { AdminTokenForm } from './AdminTokenForm';
import { AuthenticationMethodSelector } from './AuthenticationMethodSelector';
import { OtherForm } from './OtherForm';
import { UsernamePasswordForm } from './UsernamePasswordForm';

export enum AuthenticationMethod {
  usernamePassword,
  adminToken,
  other,
}

export const AuthenticationForm = ({
  method,
  username,
  password,
  token,
  otherOptions,
  onMethodChanged,
  onUsernameChanged,
  onPasswordChanged,
  onTokenChanged,
  onOtherOptionsChanged,
}: {
  method: AuthenticationMethod;
  username: string;
  password: string;
  token: string;
  otherOptions: string;
  onMethodChanged: (method: AuthenticationMethod) => void;
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOtherOptionsChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  let form;
  if (method === AuthenticationMethod.usernamePassword) {
    form = (
      <UsernamePasswordForm
        username={username}
        password={password}
        isRequired={!token}
        onUsernameChanged={onUsernameChanged}
        onPasswordChanged={onPasswordChanged}
      />
    );
  } else if (method === AuthenticationMethod.adminToken) {
    form = (
      <AdminTokenForm
        token={token}
        onTokenChanged={onTokenChanged}
        isRequired={!username}
      />
    );
  } else if (method === AuthenticationMethod.other) {
    form = (
      <OtherForm
        options={otherOptions}
        onOptionsChanged={onOtherOptionsChanged}
      />
    );
  }
  return (
    <div className="ConnectToServer__AuthenticationForm">
      <AuthenticationMethodSelector
        method={method}
        onMethodChanged={onMethodChanged}
      />
      {form}
    </div>
  );
};

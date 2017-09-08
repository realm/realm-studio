import * as React from "react";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

import { AdminTokenForm } from "./AdminTokenForm";
import { AuthenticationMethodSelector } from "./AuthenticationMethodSelector";
import { UsernamePasswordForm } from "./UsernamePasswordForm";

export enum AuthenticationMethod {
  usernamePassword,
  adminToken,
}

export const AuthenticationForm = ({
  method,
  username,
  password,
  token,
  onMethodChanged,
  onUsernameChanged,
  onPasswordChanged,
  onTokenChanged,
}: {
  method: AuthenticationMethod,
  username: string,
  password: string,
  token: string,
  onMethodChanged: (method: AuthenticationMethod) => void,
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
}) => {
  let form;
  if (method === AuthenticationMethod.usernamePassword) {
    form = (
      <UsernamePasswordForm username={username} password={password} isRequired={!token}
        onUsernameChanged={onUsernameChanged} onPasswordChanged={onPasswordChanged} />
    );
  } else if (method === AuthenticationMethod.adminToken) {
    form = (
      <AdminTokenForm token={token} onTokenChanged={onTokenChanged} isRequired={!username} />
    );
  }
  return (
    <div className="ConnectToServer__AuthenticationForm">
      <AuthenticationMethodSelector method={method} onMethodChanged={onMethodChanged} />
      {form}
    </div>
  );
};

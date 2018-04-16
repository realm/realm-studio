import * as React from 'react';
import { Input } from 'reactstrap';

import { CredentialsFormGroup } from './CredentialsFormGroup';

export const UsernamePasswordForm = ({
  isRequired,
  username,
  password,
  onUsernameChanged,
  onPasswordChanged,
}: {
  isRequired: boolean;
  username: string;
  password: string;
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <CredentialsFormGroup label="Username" labelFor="username">
      <Input
        type="text"
        name="username"
        id="username"
        size="sm"
        placeholder="realm-admin"
        value={username}
        onChange={onUsernameChanged}
      />
    </CredentialsFormGroup>
    <CredentialsFormGroup label="Password" labelFor="password">
      <Input
        type="password"
        name="password"
        id="password"
        size="sm"
        value={password}
        onChange={onPasswordChanged}
      />
    </CredentialsFormGroup>
  </div>
);

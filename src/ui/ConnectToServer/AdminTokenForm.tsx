import * as React from 'react';
import { Input } from 'reactstrap';

import { CredentialsFormGroup } from './CredentialsFormGroup';

export const AdminTokenForm = ({
  isRequired,
  token,
  onTokenChanged,
}: {
  isRequired: boolean;
  token: string;
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <CredentialsFormGroup label="Admin token" labelFor="token">
      <Input
        id="token"
        name="token"
        onChange={onTokenChanged}
        required={isRequired}
        bsSize="sm"
        type="text"
        value={token}
      />
    </CredentialsFormGroup>
  </div>
);

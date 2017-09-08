import * as React from "react";
import { Input } from "reactstrap";

import { CredentialsFormGroup } from "./CredentialsFormGroup";

export const AdminTokenForm = ({
  isRequired,
  token,
  onTokenChanged,
}: {
  isRequired: boolean,
  token: string,
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
}) => (
  <div>
    <CredentialsFormGroup label="Admin token" labelFor="token">
      <Input type="text" name="token" id="token" size="sm" required={isRequired}
        value={token} onChange={onTokenChanged} />
    </CredentialsFormGroup>
  </div>
);

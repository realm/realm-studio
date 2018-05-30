import * as React from 'react';
import { Input } from 'reactstrap';

const placeholder = `{
  "provider": "...",
  "data": { ... }
}
`;

/*
Test this with the debug authentication provider,

npm run dev:ros -- --auth debug

and this payload:

{
  "provider": "debug",
  "data": "admin"
}
*/

export const OtherForm = ({
  options,
  onOptionsChanged,
}: {
  options: string;
  onOptionsChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <Input
      type="textarea"
      placeholder={placeholder}
      className="ConnectToServer__AuthenticationForm__Payload"
      value={options}
      onChange={onOptionsChanged}
      bsSize="sm"
    />
  </div>
);

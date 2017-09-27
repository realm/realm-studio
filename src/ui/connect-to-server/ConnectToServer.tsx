import * as React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { LoadingOverlay } from "../reusable/loading-overlay";
import { AuthenticationForm, AuthenticationMethod } from "./AuthenticationForm";

import "./ConnectToServer.scss";

export const ConnectToServer = ({
  method,
  onCancel,
  onSubmit,
  onUrlChanged,
  onMethodChanged,
  onUsernameChanged,
  onPasswordChanged,
  onTokenChanged,
  url,
  username,
  password,
  token,
  isConnecting,
}: {
  method: AuthenticationMethod,
  onCancel: () => void,
  onSubmit: () => void,
  onUrlChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onMethodChanged: (method: AuthenticationMethod) => void,
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  url: string,
  username: string,
  password: string,
  token: string,
  isConnecting: boolean,
}) => {
  return (
    <Form
      className="ConnectToServer"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      <div className="ConnectToServer__ServerUrl">
        <FormGroup className="ConnectToServer__ServerUrlGroup">
          <Label for="serverUrl">URL</Label>
          <Input
            type="url"
            name="serverUrl"
            id="serverUrl"
            placeholder="http://localhost:9080"
            value={url}
            onChange={onUrlChanged}
          />
        </FormGroup>
      </div>
      <AuthenticationForm
        method={method}
        onMethodChanged={onMethodChanged}
        username={username}
        password={password}
        onUsernameChanged={onUsernameChanged}
        onPasswordChanged={onPasswordChanged}
        token={token}
        onTokenChanged={onTokenChanged}
      />
      <div className="ConnectToServer__Controls">
        <Button
          color="secondary"
          size="sm"
          className="ConnectToServer__ControlBtn"
          onClick={(e) => { e.preventDefault(); onCancel(); }}
        >
          Cancel
        </Button>
        <Button color="primary" size="sm" className="ConnectToServer__ControlBtn">
          Connect
        </Button>
      </div>
      <LoadingOverlay loading={isConnecting} />
    </Form>
  );
};

import * as React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { LoadingOverlay } from "../reusable/loading-overlay";

import "./ConnectToServer.scss";

const CredentialsFormGroup = ({
  label,
  labelFor,
  children,
}: {
  label: string,
  labelFor: string,
  children: React.ReactElement<any>,
}) => {
  return (
    <FormGroup className="ConnectToServer__CredentialsFormGroup">
      <Row noGutters={true}>
        <Col xs={3} className="ConnectToServer__CredentialsLabelCol">
          <Label for={labelFor} className="ConnectToServer__CredentialsLabel">
            {label}
          </Label>
        </Col>
        <Col xs={9}>
          {children}
        </Col>
      </Row>
    </FormGroup>
  );
};

export default ({
  onCancel,
  onSubmit,
  onUrlChanged,
  onUsernameChanged,
  onPasswordChanged,
  url,
  username,
  password,
  isConnecting,
}: {
  onCancel: () => void,
  onSubmit: () => void,
  onUrlChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  url: string,
  username: string,
  password: string,
  isConnecting: boolean,
}) => {
  return (
    <Form className="ConnectToServer" onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}>
      <div className="ConnectToServer__ServerUrl">
        <FormGroup className="ConnectToServer__ServerUrlGroup">
          <Label for="serverUrl">URL</Label>
          <Input type="url" name="serverUrl" id="serverUrl" placeholder="https://…" required
            value={url} onChange={onUrlChanged} />
        </FormGroup>
      </div>
      <div className="ConnectToServer__Authentication">
        <CredentialsFormGroup label="Username" labelFor="username">
          <Input type="text" name="username" id="username" size="sm" required
            value={username} onChange={onUsernameChanged} />
        </CredentialsFormGroup>
        <CredentialsFormGroup label="Password" labelFor="password">
          <Input type="password" name="password" id="password" size="sm" required
            value={password} onChange={onPasswordChanged} />
        </CredentialsFormGroup>
      </div>
      <div className="ConnectToServer__Controls">
        <Button color="secondary" size="sm" className="ConnectToServer__ControlBtn" onClick={(e) => {
          e.preventDefault();
          onCancel();
        }}>
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

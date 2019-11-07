////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

import { LoadingOverlay } from '../reusable/LoadingOverlay';
import { AuthenticationForm, AuthenticationMethod } from './AuthenticationForm';

import './ConnectToServer.scss';

export const ConnectToServer = ({
  method,
  onCancel,
  onSubmit,
  onUrlChanged,
  onMethodChanged,
  onUsernameChanged,
  onPasswordChanged,
  onTokenChanged,
  onOtherOptionsChanged,
  onProviderNameChanged,
  onSaveCredentialsChanged,
  url,
  username,
  password,
  token,
  otherOptions,
  providerName,
  saveCredentials,
  isConnecting,
}: {
  method: AuthenticationMethod;
  onCancel: () => void;
  onSubmit: () => void;
  onUrlChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMethodChanged: (method: AuthenticationMethod) => void;
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOtherOptionsChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProviderNameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveCredentialsChanged: (saveCredentials: boolean) => void;
  url: string;
  username: string;
  password: string;
  token: string;
  otherOptions: string;
  providerName: string;
  saveCredentials: boolean;
  isConnecting: boolean;
}) => {
  return (
    <Form
      className="ConnectToServer"
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
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
        token={token}
        otherOptions={otherOptions}
        providerName={providerName}
        onUsernameChanged={onUsernameChanged}
        onPasswordChanged={onPasswordChanged}
        onOtherOptionsChanged={onOtherOptionsChanged}
        onTokenChanged={onTokenChanged}
        onProviderNameChanged={onProviderNameChanged}
      />
      <div className="ConnectToServer__Controls">
        <FormGroup check className="ConnectToServer__SaveCredentials">
          <Label check className="ConnectToServer__SaveCredentialsLabel">
            <Input
              type="checkbox"
              checked={saveCredentials}
              onChange={e => {
                onSaveCredentialsChanged(e.target.checked);
              }}
            />{' '}
            Save credentials for this server
          </Label>
        </FormGroup>
        <FormGroup className="ConnectToServer__Actions">
          <Button
            color="secondary"
            size="sm"
            className="ConnectToServer__ControlBtn"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="sm"
            className="ConnectToServer__ControlBtn"
          >
            Connect
          </Button>
        </FormGroup>
      </div>
      <LoadingOverlay loading={isConnecting} />
    </Form>
  );
};

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
import { AuthenticationMethod } from '../../utils/realms';
import { AuthenticationForm } from './AuthenticationForm';

import './ConnectToServer.scss';

export const ConnectToServer = ({
  method,
  onCancel,
  onSubmit,
  onUrlChanged,
  onAppIdChanged,
  onMethodChanged,
  onEmailChanged,
  onPasswordChanged,
  onApiKeyChanged,
  onTokenChanged,
  onSaveCredentialsChanged,
  appId,
  url,
  email,
  password,
  apiKey,
  token,
  saveCredentials,
  isConnecting,
}: {
  method: AuthenticationMethod;
  onCancel: () => void;
  onSubmit: () => void;
  onAppIdChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMethodChanged: (method: AuthenticationMethod) => void;
  onEmailChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApiKeyChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveCredentialsChanged: (saveCredentials: boolean) => void;
  appId: string;
  url: string;
  email: string;
  password: string;
  apiKey: string;
  token: string;
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
      <div className="ConnectToServer__Top">
        <FormGroup className="ConnectToServer__AppIdGroup">
          <Label for="serverUrl">App ID</Label>
          <Input
            type="text"
            name="appId"
            id="appId"
            placeholder="myapp-"
            value={appId}
            onChange={onAppIdChanged}
            required={true}
          />
        </FormGroup>
        <FormGroup className="ConnectToServer__ServerUrlGroup">
          <Label for="serverUrl">Server URL (optional)</Label>
          <Input
            type="url"
            name="serverUrl"
            id="serverUrl"
            placeholder="https://realm.mongodb.com"
            value={url}
            onChange={onUrlChanged}
          />
        </FormGroup>
      </div>
      <AuthenticationForm
        method={method}
        onMethodChanged={onMethodChanged}
        email={email}
        password={password}
        apiKey={apiKey}
        token={token}
        onEmailChanged={onEmailChanged}
        onPasswordChanged={onPasswordChanged}
        onApiKeyChanged={onApiKeyChanged}
        onTokenChanged={onTokenChanged}
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
            Save credentials for this app
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

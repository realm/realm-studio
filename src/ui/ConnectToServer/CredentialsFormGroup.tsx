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
import { Col, FormGroup, Label, Row } from 'reactstrap';

export const CredentialsFormGroup = ({
  label,
  labelFor,
  children,
}: {
  label: string;
  labelFor: string;
  children: React.ReactElement<any>;
}) => (
  <FormGroup className="ConnectToServer__CredentialsFormGroup">
    <Row noGutters={true}>
      <Col xs={3} className="ConnectToServer__CredentialsLabelCol">
        <Label for={labelFor} className="ConnectToServer__CredentialsLabel">
          {label}
        </Label>
      </Col>
      <Col xs={9}>{children}</Col>
    </Row>
  </FormGroup>
);

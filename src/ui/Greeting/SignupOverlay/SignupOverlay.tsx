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

import * as React from 'react';
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

export const SignupOverlay = ({
  email,
  isVisible,
  newsletter,
  onEmailChange,
  onNewsletterChange,
  onSignup,
  onSkip,
}: {
  email: string;
  isVisible: boolean;
  newsletter: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewsletterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignup: () => void;
  onSkip: () => void;
}) => (
  <Modal isOpen={isVisible} className="Greeting__SignupOverlay">
    <form
      onSubmit={e => {
        e.preventDefault();
        onSignup();
      }}
    >
      <ModalBody>
        <h5>Thanks for using Realm Studio!</h5>
        <p>Please enter your email to continue.</p>
        <FormGroup>
          <Input
            id="email"
            name="email"
            onChange={onEmailChange}
            placeholder="Your e-mail address"
            required
            type="email"
            value={email}
          />
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              checked={newsletter}
              name="newsletter"
              onChange={onNewsletterChange}
              type="checkbox"
            />
            &nbsp;Send me notifications about product updates.
          </Label>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        {/*<Button onClick={onSkip}>Skip</Button>*/}
        <Button color="primary">Let's get started!</Button>
      </ModalFooter>
    </form>
  </Modal>
);

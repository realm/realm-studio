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
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import './AddSubscriptionModal.scss';

export const AddSubscriptionModal = ({
  isOpen,
  toggle,
  onSubmit,
  schemaName,
  query,
  queryError,
  onQueryChange,
}: {
  isOpen: boolean;
  toggle: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  schemaName: string;
  query: string;
  queryError: string | null;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Modal className="AddSubscriptionsModal" isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={onSubmit}>
        <ModalHeader toggle={toggle}>
          Add subscription on {schemaName}
        </ModalHeader>
        <ModalBody>
          <FormGroup className={queryError ? 'has-danger' : ''}>
            <Label for="query">Query</Label>
            <Input
              className="AddSubscriptionsModal__Query"
              name="query"
              id="query"
              type="text"
              placeholder="TRUEPREDICATE"
              value={query}
              invalid={!!queryError}
              onChange={onQueryChange}
            />
            {queryError ? (
              <FormFeedback>{queryError}</FormFeedback>
            ) : (
              <div className="AddSubscriptionsModal__Hint">
                {!query || query === 'TRUEPREDICATE' ? (
                  <>
                    The <code>TRUEPREDICATE</code> query will match all objects
                  </>
                ) : (
                  <>&nbsp;</>
                )}
              </div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" disabled={!!queryError}>
            Add subscription
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

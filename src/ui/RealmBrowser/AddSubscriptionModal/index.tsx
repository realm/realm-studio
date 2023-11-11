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

import { AddSubscriptionModal } from './AddSubscriptionModal';

export interface IAddSubscriptionModalProps {
  isOpen: boolean;
  onAddSubscription: (schemaName: string, queryString: string) => void;
  schemaName: string;
  toggle: () => void;
}

export interface IAddSubscriptionModalState {
  query: string;
  queryError: string | null;
}

const initialState: IAddSubscriptionModalState = {
  query: '',
  queryError: null,
};

class AddSubscriptionModalContainer extends React.Component<
  IAddSubscriptionModalProps,
  IAddSubscriptionModalState
> {
  public state = { ...initialState };

  public render() {
    return <AddSubscriptionModal {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.onAddSubscription(
      this.props.schemaName,
      // Fallback to selecting all objects
      this.state.query || 'TRUEPREDICATE',
    );
    this.props.toggle();
    this.setState(initialState);
  };

  public onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: e.target.value,
    });
  };
}

export { AddSubscriptionModalContainer as AddSubscriptionModal };

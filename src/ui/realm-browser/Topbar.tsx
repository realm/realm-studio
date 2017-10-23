import * as React from 'react';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

export interface ITopbarProps {
  onQueryChange: (query: string) => void;
  query: string;
}

export const Topbar = ({ onQueryChange, query }: ITopbarProps) => (
  <div className="RealmBrowser__Content__Actions">
    <InputGroup className="RealmBrowser__Content__Actions__Filter">
      <InputGroupAddon>
        <i className="fa fa-search" aria-hidden="true" />
      </InputGroupAddon>
      <Input
        onChange={e => {
          onQueryChange(e.target.value);
        }}
        placeholder="Query ..."
        value={query}
      />
    </InputGroup>
  </div>
);

import * as React from 'react';
import { Button, Input, InputGroup, InputGroupButton } from 'reactstrap';

export interface ITopbarProps {
  onQueryChange: (query: string) => void;
  onQueryHelp: () => void;
  query: string;
}

export const Topbar = ({ onQueryChange, onQueryHelp, query }: ITopbarProps) => (
  <div className="RealmBrowser__Topbar">
    <section className="RealmBrowser__Topbar__Filter">
      <InputGroup size="sm">
        <Input
          onChange={e => {
            onQueryChange(e.target.value);
          }}
          placeholder="Enter a query to filter the list"
          value={query}
        />
        <InputGroupButton>
          <Button onClick={onQueryHelp}>
            <i className="fa fa-question" aria-hidden="true" />
          </Button>
        </InputGroupButton>
      </InputGroup>
    </section>
  </div>
);

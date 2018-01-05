import * as React from 'react';
import { Button, Input, InputGroup, InputGroupButton } from 'reactstrap';

export interface IQuerySearchProps {
  onQueryChange: (query: string) => void;
  onQueryHelp?: () => void;
  query: string;
  placeholder: string;
  className?: string;
}

export const QuerySearch = ({
  onQueryChange,
  onQueryHelp,
  query,
  placeholder,
  className,
}: IQuerySearchProps) => (
  <section className={className}>
    <InputGroup size="sm">
      <Input
        onChange={e => {
          onQueryChange(e.target.value);
        }}
        placeholder={placeholder}
        value={query}
      />
      {onQueryHelp && (
        <InputGroupButton>
          <Button onClick={onQueryHelp}>
            <i className="fa fa-question" aria-hidden="true" />
          </Button>
        </InputGroupButton>
      )}
    </InputGroup>
  </section>
);

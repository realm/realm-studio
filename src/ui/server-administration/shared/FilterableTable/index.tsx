import * as React from 'react';
import { QuerySearch } from '../../../reusable/QuerySearch';
import './Table.scss';

export const FilterableTableWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="Table">{children}</div>;

export interface IProps {
  searchString: string;
  onSearchStringChange: (searchString: string) => void;
  onTableClick: () => void;
  searchPlaceholder: string;
  children: React.ReactNode;
}

export const FilterableTable = ({
  searchString,
  onSearchStringChange,
  onTableClick,
  searchPlaceholder,
  children,
}: IProps) => (
  <div className="Table__content">
    <div className="Table__topbar">
      <QuerySearch
        query={searchString}
        onQueryChange={onSearchStringChange}
        placeholder={searchPlaceholder}
      />
    </div>
    <div className="Table__table" onClick={onTableClick}>
      {children}
    </div>
  </div>
);

import * as classnames from 'classnames';
import * as React from 'react';
import {
  AutoSizer,
  Dimensions as IAutoSizerDimensions,
  Table,
} from 'react-virtualized';
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
  onElementSelected: (elementIdSelected: string | null) => void;
  searchPlaceholder: string;
  children: JSX.Element[];
  elements: Realm.Results<any>;
  elementIdProperty: string;
  selectedIdPropertyValue: string | null;
}

export const FilterableTable = ({
  searchString,
  onSearchStringChange,
  onElementSelected,
  searchPlaceholder,
  children,
  elements,
  elementIdProperty,
  selectedIdPropertyValue,
}: IProps) => (
  <div className="Table__content">
    <div className="Table__topbar">
      <QuerySearch
        query={searchString}
        onQueryChange={onSearchStringChange}
        placeholder={searchPlaceholder}
      />
    </div>
    <div className="Table__table" onClick={() => onElementSelected(null)}>
      <AutoSizer>
        {({ width, height }: IAutoSizerDimensions) => (
          <Table
            width={width}
            height={height}
            rowHeight={30}
            headerHeight={30}
            rowClassName={({ index }) => {
              const element = elements[index];
              return classnames('Table__row', {
                'Table__row--selected':
                  element &&
                  element[elementIdProperty] === selectedIdPropertyValue,
              });
            }}
            rowCount={elements.length}
            rowGetter={({ index }) => elements[index]}
            onRowClick={({ event, index }) => {
              const element = elements[index];
              onElementSelected(
                element &&
                element[elementIdProperty] !== selectedIdPropertyValue
                  ? element[elementIdProperty]
                  : null,
              );
              event.stopPropagation();
            }}
          >
            {children}
          </Table>
        )}
      </AutoSizer>
    </div>
  </div>
);

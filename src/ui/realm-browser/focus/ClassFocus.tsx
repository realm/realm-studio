import * as React from 'react';
import { GridCellProps } from 'react-virtualized';
import * as Realm from 'realm';

import { Cell } from '../Cell';
import { HeaderCell } from '../HeaderCell';
import { Focus, IRendererParams, ISortOptions } from './Focus';

// TODO: Remove this interface once the Realm.ObjectSchemaProperty
// has a name parameter in its type definition.
export interface IPropertyWithName extends Realm.ObjectSchemaProperty {
  name: string | null;
}

export class ClassFocus extends Focus {
  protected className: string;
  protected realm: Realm;
  protected results: Realm.Results<any>;
  protected properties: IPropertyWithName[];

  constructor({ realm, className }: { realm: Realm; className?: string }) {
    super();
    this.realm = realm;
    if (className) {
      this.deriveProperties(className);
      this.results = this.realm.objects(className);
      // Hold on to this class.
      this.className = className;
    }
  }

  public generateRenderers({
    columnWidths,
    filter,
    onCellChange,
    onCellClick,
    onColumnWidthChanged,
    onContextMenu,
    onSortClick,
    rowToHighlight,
    sort,
  }: IRendererParams) {
    const filteredSortedResults = this.getSortedFilteredResults({
      sort,
      filter,
    });

    const properties = this.getProperties();

    const headerRenderers = properties.map(property => {
      return (cellProps: GridCellProps) => {
        return (
          <HeaderCell
            key={cellProps.key}
            property={property}
            propertyName={property.name}
            width={columnWidths[cellProps.columnIndex]}
            style={cellProps.style}
            onWidthChanged={newWidth =>
              onColumnWidthChanged(cellProps.columnIndex, newWidth)}
            onSortClick={onSortClick}
            sort={sort ? sort.propertyName : null}
          />
        );
      };
    });

    const valueRenderers = properties.map(property => {
      return (cellProps: GridCellProps) => {
        const result = filteredSortedResults[cellProps.rowIndex];

        return (
          <Cell
            key={cellProps.key}
            width={columnWidths[cellProps.columnIndex]}
            style={cellProps.style}
            onCellClick={(
              property: Realm.ObjectSchemaProperty, // tslint:disable-line:no-shadowed-variable
              value: any,
            ) => {
              if (onCellClick) {
                onCellClick(
                  result,
                  property,
                  value,
                  cellProps.rowIndex,
                  cellProps.columnIndex,
                );
              }
            }}
            value={this.getValue(result, property)}
            property={property}
            onUpdateValue={value => {
              if (onCellChange) {
                onCellChange({
                  parent: filteredSortedResults,
                  rowIndex: cellProps.rowIndex,
                  propertyName: property.name,
                  value,
                });
              }
            }}
            isHighlighted={rowToHighlight === cellProps.rowIndex}
            onContextMenu={e => {
              if (onContextMenu) {
                onContextMenu(e, result, cellProps.rowIndex, property);
              }
            }}
          />
        );
      };
    });

    return {
      columnCount: properties.length,
      rowCount: filteredSortedResults.length,
      headerRenderers,
      valueRenderers,
    };
  }

  public getProperties() {
    return this.properties;
  }

  public isFocussingOn(className: string) {
    return this.className === className;
  }

  public getClassName() {
    return this.className;
  }

  public getResultCount() {
    return this.results.length;
  }

  protected deriveProperties(className: string) {
    // Deriving the ObjectSchema from the className
    const objectSchema = this.realm.schema.find(schema => {
      return schema.name === className;
    });
    if (!objectSchema) {
      throw new Error(`Found no object schema named '${className}'`);
    }
    // Derive the properties from the objectSchema
    this.properties = Object.keys(objectSchema.properties).map(propertyName => {
      const property = objectSchema.properties[propertyName];
      if (typeof property === 'object') {
        return {
          name: propertyName,
          ...property,
        };
      } else {
        throw new Error(`Object schema had a string describing its property`);
      }
    });
  }

  protected getValue(result: any, property: IPropertyWithName) {
    return property.name ? result[property.name] : result;
  }

  private getSortedFilteredResults({
    sort,
    filter,
  }: {
    sort?: ISortOptions;
    filter?: string;
  }): Realm.Results<any> {
    let results = this.results;
    if (filter) {
      try {
        results = results.filtered(filter);
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Could not filter "${filter}"`, err);
      }
    }

    if (sort) {
      try {
        results = results.sorted(sort.propertyName);
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Could not sort "${sort}"`, err);
      }
    }

    return results;
  }
}

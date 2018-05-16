import * as React from 'react';
import { AutoSizer, ScrollSync } from 'react-virtualized';

import { IBaseTableContainerProps, Table } from './Table';

export class ResponsiveTable extends React.PureComponent<
  IBaseTableContainerProps,
  {}
> {
  public render() {
    return (
      <div className="RealmBrowser__Table">
        <AutoSizer>
          {sizeProps => (
            <ScrollSync>
              {scrollProps => (
                <Table
                  {...this.props}
                  scrollProps={scrollProps}
                  sizeProps={sizeProps}
                />
              )}
            </ScrollSync>
          )}
        </AutoSizer>
      </div>
    );
  }
}

import * as React from 'react';
import {
  AutoSizer,
  AutoSizerProps,
  Grid,
  GridCellProps,
  ScrollSync,
  ScrollSyncProps,
} from 'react-virtualized';

import { IBaseTableContainerProps, TableContainer } from './TableContainer';

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
                <TableContainer
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

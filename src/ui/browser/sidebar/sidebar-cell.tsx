import * as React from 'react';

interface ISidebarCellProps extends React.HTMLProps<{}> {
  name: string,
  numberOfObjects: number
}

export default class SidebarCell extends React.Component<ISidebarCellProps, {}> {
  render() {
    return (
      <div>
         {this.props.name} <em className="badge">{this.props.numberOfObjects}</em>
      </div>
    );
  }
}

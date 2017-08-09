import * as React from 'react';
import * as Realm from 'realm';
import SidebarItem from './sidebar-cell';

interface ISidebarProps extends React.Props<{}> {
  realm: Realm // TODO: need to move all realm-related logic somewhere
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
}

export default class Sidebar extends React.Component<ISidebarProps, {}> {
  componentDidMount() {
    this.props.realm.addListener('change', this.forceUpdate.bind(this));
  }

  componentWillUnmount() {
    this.props.realm.removeListener('change', this.forceUpdate.bind(this));
  }

  render() {
    const realm = this.props.realm;

    const types = realm.schema.map((objectSchema) => {
      return {
        name: objectSchema.name,
        numberOfObjects: realm.objects(objectSchema.name).length
      };
    });

    const selectedIndex = this.props.selectedIndex;

    return (
      <div className="RealmBrowser__sidebar">
        <div className="header">Models</div>
        <ul>
          {types.map((type, index) =>
            <li
              key={index}
              className={index === selectedIndex ? "selected" : undefined}
              onClick={() => this.props.onSelectionChange(index)}
            >
              <SidebarItem name={type.name} numberOfObjects={type.numberOfObjects} />
            </li>)}
        </ul>
      </div>
    );
  }
}

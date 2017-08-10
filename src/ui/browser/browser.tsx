import * as React from "react";
import * as Realm from "realm";
import Content from "./content/content";
import Sidebar from "./sidebar/sidebar";

interface IBrowserProps {
  realm: Realm;
}

interface IBrowserState {
  selectedIndex: number;
}

export default class Browser extends React.Component<IBrowserProps, IBrowserState> {
  private types: Realm.ObjectSchema[];

  constructor(props: IBrowserProps) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  public sidebarSelectionChanged(index: number) {
    this.setState({
      selectedIndex: index,
    });
  }

  public render() {
    const selectedIndex = this.state.selectedIndex;
    const selectedType = this.props.realm.schema[selectedIndex];

    return (
      <div className="RealmBrowser">
        <div className="RealmBrowser__container">
          <Sidebar
            realm={this.props.realm}
            selectedIndex={selectedIndex}
            onSelectionChange={this.sidebarSelectionChanged.bind(this)}
          />
          <Content
            realm={this.props.realm}
            type={selectedType}
          />
        </div>
      </div>
    );
  }
}

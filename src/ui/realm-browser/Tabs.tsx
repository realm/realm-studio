import * as classnames from 'classnames';
import * as React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import './RealmBrowser.scss';

export interface ITab {
  data: any;
  schemaName: string;
  id: number;
  associatedObject?: any;
  isList: boolean;
}

export const Tabs = ({
  selectedTab,
  tabs,
  onTabSelected,
}: {
  selectedTab?: ITab;
  tabs: ITab[];
  onTabSelected: (tabId: number) => void;
}) => (
  <Nav className="RealmBrowser__Tabs" tabs>
    {tabs &&
      tabs.map(tab => {
        const tabClass = classnames({
          RealmBrowser__Tab: true,
          'RealmBrowser__Tab--active': selectedTab && selectedTab.id === tab.id,
        });
        const caption = `${tab.schemaName} ${tab.isList ? 'list' : 'model'}`;
        return (
          <NavItem key={tab.id}>
            <NavLink className={tabClass} onClick={() => onTabSelected(tab.id)}>
              {caption}
            </NavLink>
          </NavItem>
        );
      })}
  </Nav>
);

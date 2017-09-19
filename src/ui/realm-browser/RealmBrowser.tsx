import * as React from "react";
import * as Realm from "realm";
import * as classNames from 'classnames';

import "./RealmBrowser.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import { ContentContainer } from "./ContentContainer";
import { Sidebar } from "./Sidebar";

export const RealmBrowser = ({
  getNumberOfObjects,
  getObject,
  onCellChange,
  onSchemaSelected,
  onListCellClick,
  schemas,
  selectedSchemaName,
  selectedTab,
  tabs,
  onTabSelected,
  getSchemaLength,
}: {
  getNumberOfObjects: (name: string) => number,
  getSchemaLength: (name: string) => number,
  getObject: (index: number) => any,
  onCellChange: (index: number, propertyName: string, value: string) => void,
  onTabSelected: (id: string) => void,
  onSchemaSelected: (name: string) => void,
  onSelectTab: (index: number) => void,
  onListCellClick: () => void,
  schemas: Realm.ObjectSchema[],
  selectedSchemaName: string | null,
  selectedTab: any,
  tabs: any[],
}) => {
  const selectedSchema = schemas.find((schema) => schema.name === selectedSchemaName) || null;
  const selectedNumberOfObjects = selectedSchemaName ? getNumberOfObjects(selectedSchemaName) : 0;
  return (
    <div className="RealmBrowser">
      <Sidebar
        schemas={schemas}
        onSchemaSelected={onSchemaSelected}
        selectedSchemaName={selectedSchemaName}
        getSchemaLength={getSchemaLength}
      />
      <div className="TabsContainer">
        <Nav tabs>
          {tabs && tabs.map((t) => {
            const tabClass = classNames({
              "TabsContainer__Tab": true,
              "TabsContainer__Tab--active": selectedTab && selectedTab.id === t.id,
            });
            return (
              <NavItem>
                <NavLink
                  className={tabClass}
                  onClick={() => onTabSelected(t.id)}
                >
                  {`Tab ${t.id}`}
                </NavLink>
              </NavItem>
            );
          })}
        </Nav>
        <ContentContainer
            schema={selectedSchema}
            getObject={getObject}
            numberOfObjects={selectedNumberOfObjects}
            onCellChange={onCellChange}
            onListCellClick={onListCellClick}/>
      </div>
    </div>
  );
};

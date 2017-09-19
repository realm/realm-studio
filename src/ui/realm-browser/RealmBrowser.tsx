import * as React from "react";
import * as Realm from "realm";

import { ContentContainer } from "./ContentContainer";
import "./RealmBrowser.scss";
import { Sidebar } from "./Sidebar";
import { Tabs } from "./Tabs";

export const RealmBrowser = ({
  getNumberOfObjects,
  getSchemaLength,
  getSelectedSchema,
  getObject,
  onCellChange,
  onSchemaSelected,
  onListCellClick,
  schemas,
  selectedSchemaName,
  selectedTab,
  tabs,
  onTabSelected,
}: {
  getNumberOfObjects: (name: string) => number,
  getSchemaLength: (name: string) => number,
  getSelectedSchema: () => Realm.ObjectSchema | null,
  getObject: (index: number) => any,
  onCellChange: (index: number, propertyName: string, value: string) => void,
  onTabSelected: (id: string) => void,
  onSchemaSelected: (name: string) => void,
  onListCellClick: (property: Realm.ObjectSchemaProperty, value: any) => void,
  schemas: Realm.ObjectSchema[],
  selectedSchemaName: string | null,
  selectedTab: any,
  tabs: any[],
}) => {
  const selectedSchema = getSelectedSchema();
  const selectedNumberOfObjects = selectedSchemaName ? getNumberOfObjects(selectedSchemaName) : 0;
  return (
    <div className="RealmBrowser">
      <Sidebar
        schemas={schemas}
        onSchemaSelected={onSchemaSelected}
        selectedSchemaName={selectedSchemaName}
        getSchemaLength={getSchemaLength}
      />
      <div className="RealmBrowser__Wrapper">
        <Tabs
          tabs={tabs}
          selectedTab={selectedTab}
          onTabSelected={onTabSelected}
        />
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

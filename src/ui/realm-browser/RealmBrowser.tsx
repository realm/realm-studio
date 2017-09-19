import * as React from "react";
import * as Realm from "realm";

import {ContentContainer} from "./ContentContainer";
import "./RealmBrowser.scss";
import {Sidebar} from "./Sidebar";
import {Tabs, ITab} from "./Tabs";

export const RealmBrowser = ({
  getNumberOfObjects,
  getSchemaLength,
  getSelectedSchema,
  getObject,
  onCellChange,
  onSchemaSelected,
  onListCellClick,
  schemas,
  selectedTab,
  tabs,
  onTabSelected,
  getHighlightRowIndex,
} : {
  getNumberOfObjects: () => number,
  getSchemaLength: (name: string) => number,
  getSelectedSchema: () => Realm.ObjectSchema | null,
  getObject: (index: number) => any,
  onCellChange: (object: any, propertyName: string, value: string) => void,
  onTabSelected: (id: number) => void,
  onSchemaSelected: (name: string) => void,
  onListCellClick: (object: any, property: Realm.ObjectSchemaProperty, value: any) => void,
  schemas: Realm.ObjectSchema[],
  selectedTab?: ITab,
  tabs: ITab[],
  getHighlightRowIndex: () => number | null,
}) => {
  return (
    <div className="RealmBrowser">
      <Sidebar
        schemas={schemas}
        onSchemaSelected={onSchemaSelected}
        selectedSchemaName={selectedTab && selectedTab.schemaName}
        getSchemaLength={getSchemaLength}
      />
      <div className="RealmBrowser__Wrapper">
        <Tabs
          tabs={tabs}
          selectedTab={selectedTab}
          onTabSelected={onTabSelected}
        />
        <ContentContainer
          schema={getSelectedSchema()}
          getObject={getObject}
          numberOfObjects={getNumberOfObjects()}
          onCellChange={onCellChange}
          onListCellClick={onListCellClick}
          rowToHighlight={getHighlightRowIndex()}
        />
      </div>
    </div>
  );
};

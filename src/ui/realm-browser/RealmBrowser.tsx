import * as React from "react";
import * as Realm from "realm";

import {ContentContainer} from "./ContentContainer";
import "./RealmBrowser.scss";
import {IList} from "./RealmBrowserContainer";
import {Sidebar} from "./Sidebar";

export const RealmBrowser = ({
  getSchemaLength,
  getSelectedSchema,
  onCellChange,
  onSchemaSelected,
  onListCellClick,
  schemas,
  rowToHighlight,
  getSelectedData,
  selectedSchemaName,
  list,
}: {
  getSchemaLength: (name: string) => number,
  getSelectedData: () => any,
  getSelectedSchema: () => Realm.ObjectSchema | null,
  onCellChange: (object: any, propertyName: string, value: string) => void,
  onSchemaSelected: (name: string, objectToScroll: any) => void,
  onListCellClick: (object: any, property: Realm.ObjectSchemaProperty, value: any) => void,
  schemas: Realm.ObjectSchema[],
  rowToHighlight: number | null,
  selectedSchemaName?: string | null,
  list: IList | null,
}) => {
  const values = getSelectedData();
  return (
    <div className="RealmBrowser">
      <Sidebar
        schemas={schemas}
        onSchemaSelected={onSchemaSelected}
        selectedSchemaName={selectedSchemaName}
        getSchemaLength={getSchemaLength}
        list={list}
      />
      <div className="RealmBrowser__Wrapper">
        <ContentContainer
          schema={getSelectedSchema()}
          onCellChange={onCellChange}
          onListCellClick={onListCellClick}
          rowToHighlight={rowToHighlight}
          data={values}
        />
      </div>
    </div>
  );
};

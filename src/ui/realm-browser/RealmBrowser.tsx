import * as React from "react";
import * as Realm from "realm";

import "./RealmBrowser.scss";

import { Content } from "./Content";
import { Sidebar } from "./Sidebar";

export const RealmBrowser = ({
  getNumberOfObjects,
  onSchemaSelected,
  schemas,
  selectedSchemaName,
}: {
  getNumberOfObjects: (name: string) => number,
  onSchemaSelected: (name: string) => void,
  schemas: Realm.ObjectSchema[],
  selectedSchemaName: string | null,
}) => {
  return (
    <div className="RealmBrowser">
      <Sidebar
        schemas={schemas}
        getNumberOfObjects={getNumberOfObjects}
        selectedSchemaName={selectedSchemaName}
        onSchemaSelected={onSchemaSelected} />
      <Content />
    </div>
  );
};

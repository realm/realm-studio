import * as React from "react";
import * as Realm from "realm";

import "./RealmBrowser.scss";

import { Content } from "./Content";
import { Sidebar } from "./Sidebar";

export const RealmBrowser = ({
  getColumnWidth,
  getNumberOfObjects,
  getObject,
  onSchemaSelected,
  schemas,
  selectedSchemaName,
}: {
  getColumnWidth: (index: number) => number,
  getNumberOfObjects: (name: string) => number,
  getObject: (index: number) => any,
  onSchemaSelected: (name: string) => void,
  schemas: Realm.ObjectSchema[],
  selectedSchemaName: string | null,
}) => {
  const selectedSchema = schemas.find((schema) => schema.name === selectedSchemaName) || null;
  const selectedNumberOfObjects = selectedSchemaName ? getNumberOfObjects(selectedSchemaName) : 0;

  return (
    <div className="RealmBrowser">
      <Sidebar
        schemas={schemas}
        getNumberOfObjects={getNumberOfObjects}
        selectedSchemaName={selectedSchemaName}
        onSchemaSelected={onSchemaSelected} />
      <Content
        schema={selectedSchema}
        getColumnWidth={getColumnWidth}
        getObject={getObject}
        numberOfObjects={selectedNumberOfObjects} />
    </div>
  );
};

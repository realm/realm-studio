import * as React from "react";
import * as Realm from "realm";

import "./RealmBrowser.scss";

import { ContentContainer } from "./ContentContainer";
import { Sidebar } from "./Sidebar";

export const RealmBrowser = ({
  getNumberOfObjects,
  getObject,
  onCellChange,
  onSchemaSelected,
  schemas,
  selectedSchemaName,
}: {
  getNumberOfObjects: (name: string) => number,
  getObject: (index: number) => any,
  onCellChange: (index: number, propertyName: string, value: string) => void,
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
        onSchemaSelected={onSchemaSelected}
        selectedSchemaName={selectedSchemaName} />
      <ContentContainer
        schema={selectedSchema}
        getObject={getObject}
        numberOfObjects={selectedNumberOfObjects}
        onCellChange={onCellChange} />
    </div>
  );
};

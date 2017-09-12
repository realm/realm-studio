import * as React from "react";
import * as Realm from "realm";

export const HeaderCell = ({
  property,
  propertyName,
  style,
  width,
}: {
  property: Realm.ObjectSchemaProperty,
  propertyName: string,
  style: React.CSSProperties,
  width: number,
}) => (
  <div style={style} className="RealmBrowser__Content__Cell">
    {propertyName}
  </div>
);

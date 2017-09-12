import * as React from "react";
import * as Realm from "realm";

export const Cell = ({
  property,
  style,
  value,
  width,
}: {
  property: Realm.ObjectSchemaProperty,
  style: React.CSSProperties,
  value: any,
  width: number,
}) => (
  <div style={style} className="RealmBrowser__Content__Cell">
    {JSON.stringify(value)}
  </div>
);

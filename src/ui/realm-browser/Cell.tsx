import * as React from "react";
import * as Realm from "realm";

import { DefaultCell } from "./types/DefaultCell";
import { StringCell } from "./types/StringCell";

export const Cell = ({
  isEditing,
  onChange,
  property,
  style,
  value,
  width,
}: {
  isEditing: boolean,
  onChange: (value: string) => void,
  property: Realm.ObjectSchemaProperty,
  style: React.CSSProperties,
  value: any,
  width: number,
}) => {
  let content;
  if (property.type === "string") {
    content = <StringCell property={property} value={value} isEditing={isEditing} onChange={onChange} />;
  } else {
    content = <DefaultCell property={property} value={value} />;
  }
  return (
    <div style={style} className="RealmBrowser__Content__Cell">
      {content}
    </div>
  );
};

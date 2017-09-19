import * as React from "react";
import * as Realm from "realm";

import { DefaultCell } from "./types/DefaultCell";
import { StringCellContainer } from "./types/StringCellContainer";

export const Cell = ({
  onUpdateValue,
  property,
  style,
  value,
  width,
}: {
  onUpdateValue: (value: string) => void,
  property: Realm.ObjectSchemaProperty,
  style: React.CSSProperties,
  value: any,
  width: number,
}) => {
  let content;
  switch (property.type) {
      case "int":
      case "float":
      case "double":
      case "bool":
      case "string":
      case "date": {
          content = <StringCellContainer
              property={property} value={value}
              onUpdateValue={onUpdateValue}
          />;
          break;
      }
      default:
          content = <DefaultCell property={property} value={value} />;
  }

  return (
    <div style={style} className="RealmBrowser__Content__Cell">
      {content}
    </div>
  );
};

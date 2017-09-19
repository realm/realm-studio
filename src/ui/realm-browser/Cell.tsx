import * as React from "react";
import * as Realm from "realm";

import { DefaultCell } from "./types/DefaultCell";
import { ListCell } from "./types/ListCell";
import { ObjectCell } from "./types/ObjectCell";
import { StringCellContainer } from "./types/StringCellContainer";

export const Cell = ({
  onUpdateValue,
  onListCellClick,
  property,
  style,
  value,
  width,
}: {
  onUpdateValue: (value: string) => void,
  onListCellClick: (property: Realm.ObjectSchemaProperty, value: any) => void,
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
      case "list":
          content = <ListCell property={property} value={value} onClick={onListCellClick}/>;
          break;
      case "object":
          content = <ObjectCell property={property} value={value} onClick={onListCellClick}/>;
          break;
      default:
          content = <DefaultCell property={property} value={value} />;
  }

  return (
    <div style={style} className="RealmBrowser__Content__Cell">
      {content}
    </div>
  );
};

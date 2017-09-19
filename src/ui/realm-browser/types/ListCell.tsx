import * as classnames from "classnames";
import * as React from "react";
import { Badge } from "reactstrap";
import * as Realm from "realm";

export const ListCell = ({
  property,
  value,
  onClick,
}: {
  property: Realm.ObjectSchemaProperty,
  value: any,
  onClick: (property: Realm.ObjectSchemaProperty, value: any) => void,
}) => (
  <div
    onClick={() => onClick(property, value)}
    className={classnames(
      "form-control",
      "form-control-sm",
      "RealmBrowser__Content__Link",
    )}
  >
    {property.objectType}<Badge color="primary">{value.length}</Badge>
  </div>
);

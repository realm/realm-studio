import * as classnames from "classnames";
import * as React from "react";
import { Input } from "reactstrap";
import * as Realm from "realm";

export const DefaultCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty,
  value: any,
}) => (
  <div className={classnames(
    "form-control",
    "form-control-sm",
    "RealmBrowser__Content__Input",
    "RealmBrowser__Content__Input--disabled",
  )}>
    {JSON.stringify(value)}
  </div>
);

import * as classnames from "classnames";
import * as React from "react";
import { Input } from "reactstrap";
import * as Realm from "realm";
import * as util from "util";

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
    {util.inspect(value)}
  </div>
);

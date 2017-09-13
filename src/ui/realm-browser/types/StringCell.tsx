import * as classnames from "classnames";
import * as React from "react";
import { Input } from "reactstrap";
import * as Realm from "realm";

export const StringCell = ({
  isEditing,
  onChange,
  property,
  value,
}: {
  isEditing: boolean,
  onChange: (value: string) => void,
  property: Realm.ObjectSchemaProperty,
  value: string,
}) => isEditing ? (
  <Input className="RealmBrowser__Content__Input" size="sm" value={value} onChange={(e) => {
    onChange(e.target.value);
  }} />
) : (
  <div className={classnames("form-control", "form-control-sm", "RealmBrowser__Content__Input")}>
    {JSON.stringify(value)}
  </div>
);

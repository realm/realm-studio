import * as classnames from "classnames";
import * as React from "react";
import { Input } from "reactstrap";

export const StringCell = ({
  isEditing,
  onChange,
  onBlur,
  onFocus,
  value,
  temporalValue,
}: {
  isEditing: boolean,
  onChange: (newValue: string) => void,
  onBlur: () => void,
  onFocus: () => void,
  value: string,
  temporalValue: string,
}) => isEditing ? (
  <Input
      className="RealmBrowser__Content__Input"
      size="sm"
      value={temporalValue}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
  />
) : (
  <div
      className={classnames("form-control", "form-control-sm", "RealmBrowser__Content__Input")}
      onClick={onFocus}
  >
    {value === null ? "" : value.toString()}
  </div>
);

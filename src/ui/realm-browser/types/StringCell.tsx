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
  onBlur: (input: HTMLInputElement) => void,
  onFocus: () => void,
  value: string,
  temporalValue: string,
}) => {
    let textInput: HTMLInputElement;
    return isEditing ? (
        <Input
            className="RealmBrowser__Content__Input"
            size="sm"
            getRef={(input) => { textInput = input; }}
            value={temporalValue}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur(textInput)}
            onKeyPress={(e) => (e.key === "Enter") && onBlur(textInput)}
        />
    ) : (
        <div
            className={classnames("form-control", "form-control-sm", "RealmBrowser__Content__Input")}
            onClick={onFocus}
        >
            {value === null ? "" : value.toString()}
        </div>
    );
}

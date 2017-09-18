import * as classnames from "classnames";
import * as React from "react";
import * as Realm from "realm";
import * as util from "util";

export const ObjectCell = ({
  property,
  value,
  onClick,
}: {
  property: Realm.ObjectSchemaProperty,
  value: any,
  onClick: () => void,
}) => {
  const formatedValue = util.inspect(value);
  return <div
      onClick={onClick}
      className={classnames(
          "form-control",
          "form-control-sm",
          "RealmBrowser__Content__Link",
      )}
      title={formatedValue}
  >
      {formatedValue}
  </div>;
};

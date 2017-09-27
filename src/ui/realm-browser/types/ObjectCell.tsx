import * as classnames from "classnames";
import * as React from "react";
import * as Realm from "realm";
import * as util from "util";

export const ObjectCell = ({
  property,
  value,
  onClick,
  onContextMenu,
}: {
  property: Realm.ObjectSchemaProperty,
  value: any,
  onClick: (property: Realm.ObjectSchemaProperty, value: any) => void,
  onContextMenu: (e: React.SyntheticEvent<any>) => void,
}) => {
  const formatedValue = util.inspect(value);
  return (
    <div
      onClick={() => onClick(property, value)}
      onContextMenu={onContextMenu}
      className={classnames(
        "form-control",
        "form-control-sm",
        "RealmBrowser__Content__Link",
      )}
      title={formatedValue}
    >
      {formatedValue}
    </div>
  );
};

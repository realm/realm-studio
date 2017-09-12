import * as classnames from "classnames";
import * as React from "react";
import { Badge } from "reactstrap";

export const Sidebar = ({
  getNumberOfObjects,
  onSchemaSelected,
  schemas,
  selectedSchemaName,
}: {
  getNumberOfObjects: (name: string) => number,
  onSchemaSelected: (name: string) => void,
  schemas: Realm.ObjectSchema[],
  selectedSchemaName: string | null,
}) => (
  <div className="RealmBrowser__Sidebar">
    <div className="RealmBrowser__Sidebar__Header">
      Schemas
    </div>
    <ul className="RealmBrowser__Sidebar__SchemaList">
      {schemas.map((schema) => (
        <li key={schema.name} className={classnames("RealmBrowser__Sidebar__Schema", {
          "RealmBrowser__Sidebar__Schema--selected": selectedSchemaName === schema.name,
        })} title={schema.name} onClick={() => {
          onSchemaSelected(schema.name);
        }}>
          <span className="RealmBrowser__Sidebar__SchemaName">
            {schema.name}
          </span>
          <Badge>
            {getNumberOfObjects(schema.name)}
          </Badge>
        </li>
      ))}
    </ul>
  </div>
);

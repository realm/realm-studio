import * as React from "react";
import { Badge } from "reactstrap";

export const Sidebar = ({
  getNumberOfObjects,
  schemas,
}: {
  getNumberOfObjects: (name: string) => number,
  schemas: Realm.ObjectSchema[],
}) => (
  <div className="RealmBrowser__Sidebar">
    <p>Schemas</p>
    <ul>
      {schemas.map((schema) => (
        <li className="RealmBrowser__Sidebar__Schema">
          {schema.name}
          <Badge>{getNumberOfObjects(schema.name)}</Badge>
        </li>
      ))}
    </ul>
  </div>
);

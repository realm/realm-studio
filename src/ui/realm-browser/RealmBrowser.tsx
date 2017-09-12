import * as React from "react";
import * as Realm from "realm";

import "./RealmBrowser.scss";

import { Content } from "./Content";
import { ISchema, Sidebar } from "./Sidebar";

export const RealmBrowser = ({
  getNumberOfObjects,
  schemas,
}: {
  getNumberOfObjects: (name: string) => number,
  schemas: Realm.ObjectSchema[],
}) => {
  return (
    <div className="RealmBrowser">
      <Sidebar schemas={schemas} getNumberOfObjects={getNumberOfObjects} />
      <Content />
    </div>
  );
};

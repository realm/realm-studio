import * as React from "react";
import { Button } from "reactstrap";

import realmLogo from "realm-studio-svgs/RealmLogo.svg";

import "./Greeting.scss";

export const Greeting = ({
  version,
}: {
  version: string;
}) => (
  <div className="Greeting">
    <div className="Greeting__ActionsPanel">
      <div className="Greeting__Brand">
        <svg viewBox={realmLogo.viewBox} className="Greeting__Logo">
          <use xlinkHref={realmLogo.url} />
        </svg>
        <h3 className="Greeting__Title">
          Realm Studio
        </h3>
        <p>Version {version}</p>
      </div>
      <div className="Greeting__Actions">
        <Button className="Greeting__Action">
          Open a local Realm
        </Button>
        <Button className="Greeting__Action">
          Connect to Realm Object Server
        </Button>
      </div>
    </div>
    <div className="Greeting__HistoryPanel">
      ...
    </div>
  </div>
);

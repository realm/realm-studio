import * as React from "react";
import { Button } from "reactstrap";

import * as realmLogo from "../reusable/RealmLogo.svg";

import "./Greeting.scss";

export const Greeting = () => (
  <div className="Greeting">
    <div className="Greeting__ActionsPanel">
      <img src={realmLogo} className="Greeting__Logo" />
      <div className="Greeting__Actions">
        <Button>Connect to Realm Object Server</Button>
      </div>
    </div>
    <div className="Greeting__HistoryPanel">
    </div>
  </div>
);

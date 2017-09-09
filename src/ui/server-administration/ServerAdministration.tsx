import * as classnames from "classnames";
import * as React from "react";
import { Button, Navbar } from "reactstrap";

import { LoadingOverlay } from "../reusable/loading-overlay";
import { LogContainer } from "./logs/LogContainer";
import { RealmsTableContainer } from "./realms/RealmsTableContainer";
import { ToolsContainer } from "./tools/ToolsContainer";
import { UsersTableContainer } from "./users/UsersTableContainer";

import "./ServerAdministration.scss";

export enum Tab {
  Users = "users",
  Realms = "realms",
  Logs = "logs",
  Tools = "tools",
}

export const ServerAdministration = ({
  activeTab,
  onTabChanged,
  user,
}: {
  activeTab: Tab,
  onTabChanged: (tab: Tab) => void,
  user: Realm.Sync.User | null,
}) => {
  let content = null;
  if (user && activeTab === Tab.Users) {
    content = <UsersTableContainer user={user} />;
  } else if (user && activeTab === Tab.Realms) {
    content = <RealmsTableContainer user={user} />;
  } else if (user && activeTab === Tab.Logs) {
    content = <LogContainer user={user} />;
  } else if (user && activeTab === Tab.Tools) {
    content = <ToolsContainer user={user} />;
  } else {
    content = <p className="ServerAdministration__no-content">This tab has no content yet</p>;
  }

  const TabButton = ({
    tab,
    label,
  }: {
    tab: Tab,
    label: string,
  }) => {
    return (
      <Button color={activeTab === tab ? "primary" : "secondary"} className="ServerAdministration__tab"
      onClick={() => {
        onTabChanged(tab);
      }}>
        {label}
      </Button>
    );
  };

  return (
    <div className="ServerAdministration">
      <Navbar className="ServerAdministration__tabs">
        <TabButton tab={Tab.Users} label="Users" />
        <TabButton tab={Tab.Realms} label="Realms" />
        <TabButton tab={Tab.Logs} label="Logs" />
        {/* <TabButton tab={Tab.Tools} label="Tools" /> */}
        { user && (
          <p className="ServerAdministration__status">
            Connected to {user.server}
          </p>
        )}
      </Navbar>
      <div className="ServerAdministration__content">
        {content}
      </div>
      <LoadingOverlay loading={!user} fade={false} />
    </div>
  );
};

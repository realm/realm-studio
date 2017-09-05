import * as classnames from "classnames";
import * as React from "react";
import { Button, Navbar } from "reactstrap";

import { LoadingOverlay } from "../reusable/loading-overlay";
import { UsersTableContainer } from "./users/UsersTableContainer";

import "./ServerAdministration.scss";

export enum Tab {
  Users = "users",
  Realms = "realms",
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

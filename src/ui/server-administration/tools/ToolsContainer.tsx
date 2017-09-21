import * as React from "react";
import * as Realm from "realm";

import { createFakeUsersAndRealms } from "../../../services/mocked-ros";
import { getAdminRealm } from "../../../services/ros";

import { Tools } from "./Tools";

export class ToolsContainer extends React.Component<{
  user: Realm.Sync.User,
}, {}> {

  public render() {
    return <Tools {...this} />;
  }

  public onGenerateMockUserAndRealms = async () => {
    const userCount = 1000;
    const realmCount = 1000;

    const adminRealm = await getAdminRealm(this.props.user);
    const { createdUsers, createdRealms } = createFakeUsersAndRealms({
      adminRealm,
      userCount,
      realmCount,
    });

    alert(`Created ${createdUsers} users and ${createdRealms}`);
  }

}

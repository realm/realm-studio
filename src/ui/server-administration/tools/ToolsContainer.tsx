import * as React from "react";
import * as Realm from "realm";

import { createFakeUsersAndRealms } from "../../../services/mocked-ros";
import { getAuthRealm, getRealmManagementRealm } from "../../../services/ros";

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

    const authRealm = await getAuthRealm(this.props.user);
    const realmManagementRealm = await getRealmManagementRealm(this.props.user);
    const { createdUsers, createdRealms } = createFakeUsersAndRealms({
      authRealm,
      realmManagementRealm,
      userCount,
      realmCount,
    });

    alert(`Created ${createdUsers} users and ${createdRealms}`);
  }

}

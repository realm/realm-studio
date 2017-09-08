import * as React from "react";

import { createFakeUsersAndRealms } from "../../../services/mocked-ros";

import { Tools } from "./Tools";

export class ToolsContainer extends React.Component<{}, {}> {

  public render() {
    return <Tools {...this} />;
  }

  public onGenerateMockUserAndRealms = () => {
    const userCount = 1000;
    const realmCount = 1000;
    const { createdUsers, createdRealms } = createFakeUsersAndRealms(userCount, realmCount);
    alert(`Created ${createdUsers} users and ${createdRealms}`);
  }

}

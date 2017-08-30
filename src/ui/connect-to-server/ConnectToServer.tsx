import * as React from "react";

import "./ConnectToServer.scss";

import ServerUrlInput from "./ServerUrlInput";

export default () => {
  return (
    <div className="ConnectToServer">
      <div className="ConnectToServer__ServerUrlInput">
        <ServerUrlInput />
      </div>
      <div className="ConnectToServer__Authentication" />
      <div className="ConnectToServer__Controls" />
    </div>
  );
};

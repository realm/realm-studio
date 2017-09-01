import * as React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

import { LoadingOverlay } from "../reusable/loading-overlay";

import "./ServerAdministration.scss";

export default ({
  user,
}: {
  user: Realm.Sync.User | null,
}) => {
  return (
    <div className="ServerAdministration">
      { user && (
        <p>Logged in as {user.identity}</p>
      )}
      <LoadingOverlay loading={!user} fade={false} />
    </div>
  );
};

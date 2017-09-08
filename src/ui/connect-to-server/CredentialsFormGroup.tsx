import * as React from "react";
import { Col, FormGroup, Label, Row } from "reactstrap";

export const CredentialsFormGroup = ({
  label,
  labelFor,
  children,
}: {
  label: string,
  labelFor: string,
  children: React.ReactElement<any>,
}) => (
  <FormGroup className="ConnectToServer__CredentialsFormGroup">
    <Row noGutters={true}>
      <Col xs={3} className="ConnectToServer__CredentialsLabelCol">
        <Label for={labelFor} className="ConnectToServer__CredentialsLabel">
          {label}
        </Label>
      </Col>
      <Col xs={9}>
        {children}
      </Col>
    </Row>
  </FormGroup>
);

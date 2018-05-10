import * as React from 'react';
import { Button } from 'reactstrap';

import './Tools.scss';

export const Tools = ({
  onGenerateMockUserAndRealms,
}: {
  onGenerateMockUserAndRealms: () => void;
}) => (
  <div className="Tools">
    <Button onClick={onGenerateMockUserAndRealms}>
      Generate mock users and realms
    </Button>
    <Button disabled={true}>Generate entries in the log</Button>
  </div>
);

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as classNames from 'classnames';
import * as React from 'react';
import { Button } from 'reactstrap';

interface IAddColumnControlProps {
  isHidden: boolean;
  left: number;
  onClick: () => void;
}

export const AddColumnControl = ({
  isHidden,
  left,
  onClick,
}: IAddColumnControlProps) => (
  <div
    className={classNames('RealmBrowser__Table__AddColumnControl', {
      'RealmBrowser__Table__AddColumnControl--hidden': isHidden,
    })}
    style={{ left }}
  >
    <Button onClick={onClick} size="sm">
      <i className="fa fa-plus" />
    </Button>
  </div>
);

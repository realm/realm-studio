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

import * as React from 'react';
import { Badge } from 'reactstrap';

import * as ros from '../../../services/ros';

export interface IRealmTypeBadge {
  className?: string;
  type?: ros.RealmType;
  short?: boolean;
}

const getColor = (type?: ros.RealmType) => {
  if (type === 'reference') {
    return 'primary';
  } else if (type === 'partial') {
    return 'warning';
  } else {
    return 'secondary';
  }
};

export const RealmTypeBadge = ({
  className,
  type,
  short = false,
}: IRealmTypeBadge) => {
  // Use 'full' if an empty string is passed as type.
  type = type || 'full';
  const color = getColor(type);
  const displayType = short ? type.charAt(0).toUpperCase() : type;
  return (
    <Badge className={className} color={color}>
      <span title={type}>{displayType}</span>
    </Badge>
  );
};

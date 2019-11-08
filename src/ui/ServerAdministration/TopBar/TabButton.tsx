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

import React from 'react';
import { Button } from 'reactstrap';

import { Tab } from '../ServerAdministration';

export interface ITabButtonProps {
  activeTab: Tab | null;
  label: string;
  onTabChanged: (tab: Tab) => void;
  tab: Tab;
}

export const TabButton = ({
  activeTab,
  label,
  onTabChanged,
  tab,
}: ITabButtonProps) => {
  return (
    <Button
      color={activeTab === tab ? 'primary' : 'secondary'}
      className="TopBar__TabButton"
      onClick={() => {
        onTabChanged(tab);
      }}
    >
      {label}
    </Button>
  );
};

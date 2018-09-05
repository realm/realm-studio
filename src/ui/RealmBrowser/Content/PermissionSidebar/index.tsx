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

import { Sidebar, SidebarBody, SidebarTitle } from '../../../reusable';
import { Focus } from '../../focus';
import { IHighlight } from '../Table';

interface IPermissionSidebarProps {
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
  highlight?: IHighlight;
  focus: Focus;
}

export const PermissionSidebar = ({
  className,
  isOpen,
  onToggle,
  focus,
  highlight,
}: IPermissionSidebarProps) => (
  <Sidebar
    className={className}
    isOpen={isOpen}
    onToggle={onToggle}
    position="right"
  >
    <SidebarTitle size="md">Permissions</SidebarTitle>
    <SidebarBody>{highlight ? highlight.rows.size : null}</SidebarBody>
    <SidebarBody>
      {highlight
        ? Array.from(highlight.rows.values()).map(index => index)
        : null}
    </SidebarBody>
  </Sidebar>
);

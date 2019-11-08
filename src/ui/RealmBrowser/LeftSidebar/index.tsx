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

import { ClassFocussedHandler } from '..';
import { store } from '../../../store';
import { ILoadingProgress } from '../../reusable';
import { Focus } from '../focus';

import { LeftSidebar } from './LeftSidebar';

function isSystemClassName(className: string) {
  return className.indexOf('__') === 0;
}

interface ILeftSidebarContainerProps {
  classes: Realm.ObjectSchema[];
  className?: string;
  focus: Focus | null;
  getSchemaLength: (className: string) => number;
  isOpen: boolean;
  onClassFocussed: ClassFocussedHandler;
  onToggle: () => void;
  progress: ILoadingProgress;
  readOnly?: boolean;
  toggleAddClass: () => void;
}

interface ILeftSidebarContainerState {
  hideSystemClasses: boolean;
}

class LeftSidebarContainer extends React.Component<
  ILeftSidebarContainerProps,
  ILeftSidebarContainerState
> {
  public state: ILeftSidebarContainerState = {
    hideSystemClasses: !store.shouldShowSystemClasses(),
  };

  private removeShowSystemClassesListener: (() => void) | null = null;

  public componentDidMount() {
    this.removeShowSystemClassesListener = store.onDidChange(
      store.KEY_SHOW_SYSTEM_CLASSES,
      this.onShowSystemClassesChange,
    );
  }

  public componentWillUnmount() {
    if (typeof this.removeShowSystemClassesListener === 'function') {
      this.removeShowSystemClassesListener();
    }
  }

  public render() {
    const classes = this.filterClasses(this.props.classes);
    const hiddenClassCount = Math.max(
      this.props.classes.length - classes.length,
      0,
    );
    return (
      <LeftSidebar
        classes={classes}
        className={this.props.className}
        focus={this.props.focus}
        getSchemaLength={this.props.getSchemaLength}
        hiddenClassCount={hiddenClassCount}
        isOpen={this.props.isOpen}
        onClassFocussed={this.props.onClassFocussed}
        onToggle={this.props.onToggle}
        progress={this.props.progress}
        readOnly={this.props.readOnly || false}
        toggleAddClass={this.props.toggleAddClass}
      />
    );
  }

  private filterClasses(classes: Realm.ObjectSchema[]) {
    if (this.state.hideSystemClasses) {
      return classes.filter(c => !isSystemClassName(c.name));
    } else {
      return classes;
    }
  }

  private onShowSystemClassesChange = (showSystemClasses: boolean) => {
    this.setState({ hideSystemClasses: !showSystemClasses }, () => {
      const shouldSelectAnotherClass = this.isFocussedOnSystemClass();
      if (showSystemClasses === false && shouldSelectAnotherClass) {
        // Focus on another class
        const firstClass = this.props.classes.find(
          c => !isSystemClassName(c.name),
        );
        if (firstClass) {
          this.props.onClassFocussed(firstClass.name);
        }
      }
    });
  };

  private isFocussedOnSystemClass() {
    const { focus } = this.props;
    if (focus && focus.kind === 'class') {
      return isSystemClassName(focus.className);
    } else if (focus && focus.kind === 'list') {
      return isSystemClassName(focus.parent.objectSchema().name);
    } else {
      return false;
    }
  }
}

export { LeftSidebarContainer as LeftSidebar };

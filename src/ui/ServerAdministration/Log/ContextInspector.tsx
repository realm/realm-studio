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
import ObjectInspector = require('react-object-inspector');

interface IContextInspectorProps {
  data: object;
  name?: string;
  path?: string;
  initialExpandedPaths?: string[];
  onUpdated: () => void;
}

interface IExpandedPaths {
  [path: string]: boolean;
}

interface IContextInspectorState {
  expandedPaths: IExpandedPaths;
}

function didExpandedPathsChange(a: IExpandedPaths, b: IExpandedPaths) {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  // With no expanded paths in either - they cannot differ
  if (aProps.length === 0 && bProps.length === 0) {
    return false;
  }

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return true;
  }

  for (const propName of aProps) {
    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return true;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return false;
}

export class ContextInspector extends ObjectInspector<IContextInspectorProps> {
  // ObjectInspector mutates the expandedPaths object
  protected previouslyExpandedPaths?: IExpandedPaths;

  public componentDidUpdate(
    prevProps: Readonly<IContextInspectorProps>,
    prevState: Readonly<IContextInspectorState>,
    prevContext: any,
  ) {
    if (this.previouslyExpandedPaths) {
      const changed = didExpandedPathsChange(
        this.state.expandedPaths,
        this.previouslyExpandedPaths,
      );
      // If it changed - ensure the consumer knows the component was updated
      if (changed) {
        this.props.onUpdated();
      }
    }
    // Save this for later
    this.previouslyExpandedPaths = { ...this.state.expandedPaths };
  }
}

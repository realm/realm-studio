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

declare module '*.svg' {
  const svg: {
    id: string;
    viewBox: string;
    url: string;
  };
  export default svg;
}

// Adding module declarations for packages that has no types available

declare module 'mixpanel-browser' {
  export = mixpanel;
}

declare module 'react-object-inspector' {
  interface IObjectInpectorProps {
    name?: string;
    data: object;
    /** initial paths of the nodes that are visible */
    initialExpandedPaths?: string[];
    depth?: number;
    /** path is dot separated property names to reach the current node */
    path?: string;
  }

  interface IObjectInpectorState {
    expandedPaths: { [path: string]: boolean };
  }

  class ObjectInspector<
    P extends IObjectInpectorProps = IObjectInpectorProps,
    S extends IObjectInpectorState = IObjectInpectorState
  > extends React.Component<P, S> {
    protected setExpanded(path: string, expanded: boolean): void;
  }
  export = ObjectInspector;
}

declare module 'memoize-one' {
  // Type definitions for memoize-one 3.1
  // Project: https://github.com/alexreardon/memoize-one#readme
  // Definitions by: Karol Majewski <https://github.com/karol-majewski>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  export default memoizeOne;

  function memoizeOne<T extends (...args: any[]) => any>(
    resultFn: T,
    isEqual?: memoizeOne.EqualityFn,
  ): T;

  namespace memoizeOne {
    type EqualityFn = (a: any, b: any) => boolean;
  }
}

declare module 'spectron-fake-dialog' {
  import { Application } from 'spectron';
  export function apply(application: Application): void;
  interface IDialog {
    method: 'showOpenDialog' | 'showSaveDialog';
    value: object;
  }
  export function mock(dialogs: IDialog[]): void;
}

declare module 'segfault-handler' {
  export function registerHandler(path: string): void;
}

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

// tslint:disable:max-classes-per-file

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

declare module 'react-inspector' {
  type NodeRenderer = (props: IConnectedTreeNodeProps) => React.ReactNode;

  export interface ITreeNodeProps {
    name: string;
    data: any;
    expanded: boolean;
    shouldShowArrow: boolean;
    shouldShowPlaceholder: boolean;
    nodeRenderer: NodeRenderer;
    onClick: React.MouseEventHandler;
  }

  export interface IConnectedTreeNodeProps {
    name: string;
    data: any;
    expanded: boolean;
    dataIterator: () => any;
    nodeRenderer: NodeRenderer;
    depth: number;
    // This is not officially a prop of the ConnectedTreeNode, but it seems to be passed
    isNonenumerable: boolean;
  }

  /**
   * Like console.log. Consider this as a glorified version of <pre>JSON.stringify(data, null, 2)</pre>.
   * @see https://www.npmjs.com/package/react-inspector#objectinspector-
   */
  export interface IObjectInpectorProps {
    /**
     * The Javascript object you would like to inspect
     */
    data: any;
    /**
     * Specify the optional name of the root node, default to undefined
     * @see https://www.npmjs.com/package/react-inspector#name-proptypesstring--specify-the-optional-name-of-the-root-node-default-to-undefined
     */
    name?: string;
    /**
     * An integer specifying to which level the tree should be initially expanded.
     * @see https://www.npmjs.com/package/react-inspector#expandlevel-proptypesnumber--an-integer-specifying-to-which-level-the-tree-should-be-initially-expanded
     */
    expandLevel?: number;
    /**
     * An array containing all the paths that should be expanded when the component is initialized,
     * or a string of just one path.
     * @see https://www.npmjs.com/package/react-inspector#expandpaths-proptypesoneoftypeproptypesstring-proptypesarray--an-array-containing-all-the-paths-that-should-be-expanded-when-the-component-is-initialized-or-a-string-of-just-one-path
     */
    expandPaths?: string[] | string;
    /**
     * Show non-enumerable properties.
     * @see https://www.npmjs.com/package/react-inspector#shownonenumerable-proptypesbool--show-non-enumerable-properties
     */
    showNonenumerable?: boolean;
    /**
     * Sort object keys with optional compare function.
     * @see https://www.npmjs.com/package/react-inspector#sortobjectkeys-proptypesoneoftypeproptypesbool-proptypesfunc--sort-object-keys-with-optional-compare-function
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description
     */
    sortObjectKeys?: boolean | ((a: any, b: any) => number);
    /**
     * Use a custom nodeRenderer to render the object properties.
     * @see https://www.npmjs.com/package/react-inspector#noderenderer-proptypesfunc--use-a-custom-noderenderer-to-render-the-object-properties-optional
     */
    nodeRenderer?: NodeRenderer;
  }

  /*
  export interface IObjectInpectorState {
    expandedPaths: { [path: string]: boolean };
  }
  */

  export class ObjectInspector<
    P extends IObjectInpectorProps = IObjectInpectorProps
  > extends React.Component<P, {}> {
    protected setExpanded(path: string, expanded: boolean): void;
  }

  export interface IObjectLabelProps {
    name: string;
    data: any;
    /**
     * Non enumerable object property will be dimmed
     */
    isNonenumerable: boolean;
  }

  /**
   * Renders the object with a label.
   * if isNonenumerable is specified, render the name dimmed
   */
  export class ObjectLabel extends React.Component<IObjectLabelProps> {}

  export interface IObjectValueProps {
    object: any;
  }
  export class ObjectValue extends React.Component<IObjectValueProps> {}
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

declare module 'graphiql' {
  import * as React from 'react';

  export type Fetcher = (graphQLParams: object) => void;

  interface IGraphiQLProps {
    /**
     * a function which accepts GraphQL-HTTP parameters and returns a Promise or Observable which resolves to the
     * GraphQL parsed JSON response.
     */
    fetcher: Fetcher;

    /**
     * a GraphQLSchema instance or null if one is not to be used. If undefined is provided, GraphiQL will send an
     * introspection query using the fetcher to produce a schema.
     */
    query?: string;

    /**
     * an optional GraphQL string to use as the initial displayed query variables, if undefined is provided, the stored
     * variables will be used.
     */
    variables?: string;

    /**
     * an optional name of which GraphQL operation should be executed.
     */
    operationName?: string;

    /**
     * an optional JSON string to use as the initial displayed response. If not provided, no response will be initially
     * shown. You might provide this if illustrating the result of the initial query.
     */
    response?: string;

    /** an instance of [Storage][] GraphiQL will use to persist state. Default: window.localStorage. */
    // storage
    /**
     * an optional GraphQL string to use when no query is provided and no stored query exists from a previous session.
     * If `undefined` is provided, GraphiQL will use its own default query.
     */
    defaultQuery?: string;

    /**
     * an optional function which will be called when the Query editor changes. The argument to the function will be the
     * query string.
     */
    onEditQuery?: (query: string) => void;

    /**
     * an optional function which will be called when the Query variable editor changes. The argument to the function
     * will be the variables string.
     */
    onEditVariables?: (variables: string) => void;

    /**
     * an optional function which will be called when the operation name to be executed changes.
     */
    onEditOperationName?: (operationName: string) => void;

    /**
     * an optional function which will be called when the docs will be toggled. The argument to the function will be a
     * boolean whether the docs are now open or closed.
     */
    onToggleDocs?: () => void;

    /** an optional function used to provide default fields to non-leaf fields which invalidly lack a selection set. Accepts a GraphQLType instance and returns an array of field names. If not provided, a default behavior will be used. */
    // getDefaultFieldNames
    /**
     * an optional string naming a CodeMirror theme to be applied to the QueryEditor, ResultViewer, and Variables panes.
     * Defaults to the graphiql theme. See https://github.com/graphql/graphiql for full usage.
     */
    editorTheme?: string;
  }
  const GraphiQL: React.ComponentType<IGraphiQLProps>;
  export default GraphiQL;
}

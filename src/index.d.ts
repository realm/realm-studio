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

declare module 'keytar-prebuild' {
  import * as keytar from 'keytar';
  export = keytar;
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

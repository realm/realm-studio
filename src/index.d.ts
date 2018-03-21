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

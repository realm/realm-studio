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
import ReactDOM from 'react-dom';
import { NodeRenderer, ObjectInspector, ObjectLabel } from 'react-inspector';

interface IContextInspectorProps {
  context: { [key: string]: any } | null;
  onUpdated: () => void;
}

export class ContextInspector extends React.Component<IContextInspectorProps> {
  private resizeObserver = new ResizeObserver(() => {
    this.props.onUpdated();
  });
  private objectInspectorRef = React.createRef<ObjectInspector>();

  public componentDidMount() {
    const objectInspector = this.objectInspectorRef.current;
    if (objectInspector) {
      const element = ReactDOM.findDOMNode(objectInspector);
      if (element instanceof Element) {
        this.resizeObserver.observe(element);
      }
    }
  }

  public componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  public render() {
    const children = [];
    const context = this.props.context || {};
    const keys = Object.keys(context);
    for (const key of keys) {
      const data = context[key];
      children.push(
        <ObjectInspector
          name={key}
          key={key}
          data={data}
          ref={this.objectInspectorRef}
          nodeRenderer={this.nodeRenderer}
        />,
      );
    }
    return children;
  }

  private nodeRenderer: NodeRenderer = props => (
    <ObjectLabel
      name={props.name}
      data={props.data}
      isNonenumerable={props.isNonenumerable}
    />
  );
}

import * as React from 'react';
import * as Realm from 'realm';

import { IPropertyWithName } from '../../..';
import { IClassFocus } from '../../../focus';
import { IBaseControlProps } from '../TypeControl';

import { ObjectControl } from './ObjectControl';

export interface IObjectControlContainerProps extends IBaseControlProps {
  getClassFocus: (className: string) => IClassFocus;
}

export interface IObjectControlContainerState {
  isObjectSelectorOpen: boolean;
  focus?: IClassFocus;
}

class ObjectControlContainer extends React.Component<
  IObjectControlContainerProps,
  IObjectControlContainerState
> {
  public state: IObjectControlContainerState = {
    isObjectSelectorOpen: false,
  };

  public componentDidMount() {
    if (this.props.property.objectType) {
      const className = this.props.property.objectType;
      this.setState({
        focus: this.props.getClassFocus(className),
      });
    }
  }

  public render() {
    return (
      <ObjectControl
        children={this.props.children}
        focus={this.state.focus}
        isObjectSelectorOpen={this.state.isObjectSelectorOpen}
        property={this.props.property}
        toggleObjectSelector={this.toggleObjectSelector}
        updateObjectReference={this.updateObjectReference}
        value={this.props.value}
      />
    );
  }

  protected toggleObjectSelector = () => {
    this.setState({ isObjectSelectorOpen: !this.state.isObjectSelectorOpen });
  };

  protected updateObjectReference = (object: Realm.Object | null) => {
    this.props.onChange(object);
    this.setState({ isObjectSelectorOpen: false });
  };
}

export { ObjectControlContainer as ObjectControl };

import * as React from 'react';
import { Button, InputGroup, InputGroupButton } from 'reactstrap';
import * as Realm from 'realm';

import { IPropertyWithName } from '../..';
import { displayObject } from '../../display';
import { IClassFocus } from '../../focus';
import { ObjectSelector } from '../../object-selector';

import { ITypeControlProps } from './TypeControl';

export interface IObjectControlContainerState {
  isObjectSelectorOpen: boolean;
  focus?: IClassFocus;
}

export class ObjectControlContainer extends React.Component<
  ITypeControlProps,
  IObjectControlContainerState
> {
  constructor() {
    super();
    this.state = {
      isObjectSelectorOpen: false,
    };
  }

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
      <section className="CreateObjectDialog__ObjectControl">
        <InputGroup>
          <div className="CreateObjectDialog__ObjectControl__FormControl form-control">
            <span className="CreateObjectDialog__ObjectControl__Display">
              {displayObject(this.props.value)}
            </span>
          </div>

          <InputGroupButton>
            <Button
              className="CreateObjectDialog__ObjectControl__SelectButton"
              onClick={this.toggleObjectSelector}
              size="sm"
            >
              {this.props.value ? 'Select another' : `Select`}
            </Button>
          </InputGroupButton>
          {this.props.value !== null ? (
            <InputGroupButton>
              <Button
                size="sm"
                onClick={() => this.updateObjectReference(null)}
              >
                <i className="fa fa-close" />
              </Button>
            </InputGroupButton>
          ) : null}
        </InputGroup>

        {this.state.focus ? (
          <ObjectSelector
            focus={this.state.focus}
            isOpen={this.state.isObjectSelectorOpen}
            isOptional={this.props.property.optional}
            onObjectSelected={this.updateObjectReference}
            toggle={this.toggleObjectSelector}
          />
        ) : null}
      </section>
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

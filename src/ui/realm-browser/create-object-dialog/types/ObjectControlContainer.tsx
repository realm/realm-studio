import * as classNames from 'classnames';
import * as React from 'react';
import { Button, InputGroup, InputGroupButton } from 'reactstrap';
import * as Realm from 'realm';

import { IPropertyWithName } from '../..';
import { displayObject } from '../../display';
import { IClassFocus } from '../../focus';
import { ObjectSelector } from '../../object-selector';

import { IBaseControlProps } from './TypeControl';

export interface IObjectControlContainerProps extends IBaseControlProps {
  getClassFocus: (className: string) => IClassFocus;
}

export interface IObjectControlContainerState {
  isObjectSelectorOpen: boolean;
  focus?: IClassFocus;
}

export class ObjectControlContainer extends React.Component<
  IObjectControlContainerProps,
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
    const { value, property } = this.props;
    return (
      <section className="CreateObjectDialog__ObjectControl">
        <InputGroup>
          <div
            onClick={this.toggleObjectSelector}
            className="CreateObjectDialog__ObjectControl__FormControl form-control"
          >
            <span
              className={classNames(
                'CreateObjectDialog__ObjectControl__Display',
                {
                  'CreateObjectDialog__ObjectControl__Display--null':
                    value === null,
                },
              )}
            >
              {displayObject(value)}
            </span>
          </div>
          {value !== null && property.optional ? (
            <InputGroupButton>
              <Button
                size="sm"
                onClick={() => this.updateObjectReference(null)}
              >
                <i className="fa fa-close" />
              </Button>
            </InputGroupButton>
          ) : null}
          {this.props.children}
        </InputGroup>

        {this.state.focus ? (
          <ObjectSelector
            focus={this.state.focus}
            isOpen={this.state.isObjectSelectorOpen}
            isOptional={property.optional}
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

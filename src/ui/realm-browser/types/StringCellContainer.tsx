import { remote } from 'electron';
import * as moment from 'moment';
import * as React from 'react';
import * as Realm from 'realm';
import { StringCell } from './StringCell';

export interface IStringCellContainerProps {
  onUpdateValue: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  value: string;
  onContextMenu: (e: React.SyntheticEvent<any>) => void;
  onClick: (property: Realm.ObjectSchemaProperty, value: any) => void;
}

export class StringCellContainer extends React.Component<
  IStringCellContainerProps,
  {
    temporalValue: string;
    isEditing: boolean;
  }
> {
  constructor(props: IStringCellContainerProps) {
    super();
    this.state = {
      temporalValue: props.value,
      isEditing: false,
    };
  }

  public componentWillReceiveProps(props: IStringCellContainerProps) {
    const { value } = props;
    const { isEditing } = this.state;

    if (!isEditing) {
      this.setState({
        temporalValue: value,
      });
    }
  }

  public render() {
    const { value, onContextMenu, onClick, property } = this.props;

    return (
      <StringCell
        onContextMenu={onContextMenu}
        value={value}
        onClick={onClick}
        property={property}
        {...this.state}
        {...this}
      />
    );
  }

  public onFocus = (): void => {
    this.setState({ isEditing: true });
  };

  public onChange = (newValue: string): void => {
    this.setState({
      temporalValue: newValue,
    });
  };

  public onBlur = (input: HTMLInputElement): void => {
    const { value, property, onUpdateValue } = this.props;
    const { temporalValue } = this.state;
    let parsedValue: any;
    let errorMessage: string = 'Unexpected error';

    if (temporalValue === '') {
      if (property.optional) {
        parsedValue = null;
        errorMessage = 'This field is not optional.';
      }
    } else {
      switch (property.type) {
        case 'int':
        case 'float':
        case 'double': {
          parsedValue = this.getParsedNumberValue(temporalValue, property);
          // tslint:disable-next-line:max-line-length
          errorMessage = `This field is of type ${property.type}. Your input of "${temporalValue}" isn't a proper ${property.type} value.`;
          break;
        }
        case 'bool': {
          parsedValue = this.getParsedBoolValue(temporalValue);
          // tslint:disable-next-line:max-line-length
          errorMessage = `This field is of type ${property.type}. Your input of "${temporalValue}" isn't a proper ${property.type} value. Try "true", "false", or even "0" for false or "1" for true.`;
          break;
        }
        case 'string':
          parsedValue = temporalValue;
          break;
        case 'date':
          if (moment(temporalValue).isValid()) {
            parsedValue = new Date(temporalValue);
          }
          // tslint:disable-next-line:max-line-length
          errorMessage = `This field is of type ${property.type}. Your input of "${temporalValue}" isn't a proper ${property.type} value.`;
          break;
        default:
      }
    }

    if (typeof parsedValue !== 'undefined') {
      onUpdateValue(parsedValue);
      this.setState({ temporalValue: parsedValue });
      this.setState({ isEditing: false });
    } else {
      this.showInvalidValueError(errorMessage).then(shouldResetValue => {
        if (shouldResetValue) {
          this.setState({ temporalValue: value });
          this.setState({ isEditing: false });
        } else {
          input.focus();
        }
      });
    }
  };

  private getParsedNumberValue = (
    value: string,
    property: Realm.ObjectSchemaProperty,
  ): number | undefined => {
    const parsedValue =
      property.type === 'int' ? parseInt(value, 10) : parseFloat(value);

    return isNaN(parsedValue) ? undefined : parsedValue;
  };

  private getParsedBoolValue = (value: string): boolean | undefined => {
    const safeValue = value
      .toString()
      .trim()
      .toLowerCase();

    switch (safeValue) {
      case 'true':
      case '1':
        return true;
      case 'false':
      case '0':
        return false;
      default:
        return undefined;
    }
  };

  private showInvalidValueError(message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      remote.dialog.showMessageBox(
        remote.getCurrentWindow(),
        {
          type: 'warning',
          // tslint:disable-next-line:max-line-length
          message: `${message}\n\nIf you leave the cell with an invalid value, the changes to the content will not be saved.`,
          title: `Updating cell`,
          buttons: ['Leave without saving', 'Keep editing'],
          defaultId: 1,
          cancelId: 1,
        },
        response => {
          resolve(response === 0);
        },
      );
    });
  }
}

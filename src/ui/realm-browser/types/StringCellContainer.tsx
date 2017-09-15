import { remote } from "electron";
import * as moment from "moment";
import * as React from "react";
import * as Realm from "realm";
import { StringCell } from "./StringCell";

export interface IStringCellContainerProps {
    onUpdateValue: (value: any) => void;
    property: Realm.ObjectSchemaProperty;
    value: string;
}

export class StringCellContainer extends React.Component<IStringCellContainerProps, {
    temporalValue: string,
    isEditing: boolean,
}> {
    constructor(props: IStringCellContainerProps) {
        super();
        this.state = {
            temporalValue: props.value,
            isEditing: false,
        };
    }

    public componentWillReceiveProps(props: IStringCellContainerProps) {
        const {value} = props;
        const {isEditing} = this.state;

        if (!isEditing) {
            this.setState({
                temporalValue: value,
            });
        }
    }

    public render() {
        const {value} = this.props;

        return <StringCell value={value} {...this.state} {...this} />;
    }

    public onFocus = (): void => {
        this.setState({isEditing: true});
    }

    public onChange = (newValue: string): void => {
        this.setState({
            temporalValue: newValue,
        });
    }

    public onBlur = (input: HTMLInputElement): void => {
        const {value, property, onUpdateValue} = this.props;
        const {temporalValue} = this.state;
        let parsedValue: any;
        let errorMessage: string = "Unexpected error";

        if (temporalValue === "") {
            if (property.optional) {
                parsedValue = null;
                errorMessage = "This field is not optional.";
            }
        } else {
            switch (property.type) {
                case "int":
                case "float":
                case "double": {
                    parsedValue = this.getParsedNumberValue(temporalValue, property);
                    // tslint:disable-next-line:max-line-length
                    errorMessage = `This field is of type ${property.type}. Your input of "${temporalValue}" isn't a proper ${property.type} value.`;
                    break;
                }
                case "bool": {
                    parsedValue = this.getParsedBoolValue(temporalValue);
                    // tslint:disable-next-line:max-line-length
                    errorMessage = `This field is of type ${property.type}. Your input of "${temporalValue}" isn't a proper ${property.type} value. Try "true", "false", or even "0" for false or "1" for true.`;
                    break;
                }
                case "string":
                    parsedValue = temporalValue;
                    break;
                case "date":
                    if (moment(temporalValue).isValid()) {
                        parsedValue = new Date(parsedValue);
                    }
                    // tslint:disable-next-line:max-line-length
                    errorMessage = `This field is of type ${property.type}. Your input of "${temporalValue}" isn't a proper ${property.type} value.`;
                    break;
                default:
            }
        }

        if (typeof parsedValue !== "undefined") {
            onUpdateValue(parsedValue);
            this.setState({isEditing: false});
        } else {
            this.showInvalidValueError(errorMessage).then((shouldResetValue) => {
                if (shouldResetValue) {
                    this.setState({temporalValue: value});
                    this.setState({isEditing: false});
                } else {
                    input.focus();
                }
            });
        }
    }

    private getParsedNumberValue = (value: string, property: Realm.ObjectSchemaProperty): number | undefined => {
        const parsedValue = property.type === "int" ? parseInt(value, 10) : parseFloat(value);

        return isNaN(parsedValue) ? undefined : parsedValue;
    }

    private getParsedBoolValue = (value: string): boolean | undefined => {
        const safeValue = value.toString().trim().toLowerCase();

        switch (safeValue) {
            case "true":
            case "1":
                return true;
            case "false":
            case "0":
                return false;
            default:
                return undefined;
        }
    }

    private showInvalidValueError(message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                type: "error",
                message: `${message} \n If you leave the cell, value will not be saved.`,
                title: `Updating cell`,
                buttons: ["Ok", "Cancel"],
            }, (response) => {
                resolve(response === 0);
            });
        });
    }
}

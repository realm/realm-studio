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

import * as electron from 'electron';
import memoize from 'memoize-one';
import * as React from 'react';

import {
  ClassFocussedHandler,
  EditMode,
  IPropertyWithName,
  ListFocussedHandler,
} from '..';
import { getRange } from '../../../utils';
import { showError } from '../../reusable/errors';
import { ILoadingProgress } from '../../reusable/LoadingOverlay';
import { Focus, getClassName, IClassFocus } from '../focus';
import { isPrimitive } from '../primitives';

import { Content, IContentProps } from './Content';
import { ICreateObjectDialogContainerProps } from './CreateObjectDialog';
import { IDeleteObjectsDialogProps } from './DeleteObjectsDialog';
import { IOpenSelectObjectDialogContainerProps } from './SelectObjectDialog';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  ReorderingEndHandler,
  ReorderingStartHandler,
} from './Table';

export type CreateObjectHandler = (className: string, values: {}) => void;
export type QueryChangeHandler = (query: string) => void;
export type SortingChangeHandler = (sorting: ISorting | undefined) => void;

export interface ISorting {
  property: IPropertyWithName;
  reverse: boolean;
}

export type SelectObjectAction =
  | { type: 'object'; object: Realm.Object; propertyName: string }
  | { type: 'list'; list: Realm.List<any> };

export interface IOpenSelectObjectDialog
  extends IOpenSelectObjectDialogContainerProps {
  action: SelectObjectAction;
  isOpen: true;
}

export type ISelectObjectDialog = IOpenSelectObjectDialog | { isOpen: false };

export interface IBaseContentContainerProps {
  dataVersion?: number;
  editMode: EditMode;
  focus: Focus;
  onCellClick?: CellClickHandler;
  onClassFocussed?: ClassFocussedHandler;
  onListFocussed?: ListFocussedHandler;
  progress?: ILoadingProgress;
  readOnly: boolean;
}

export interface IReadOnlyContentContainerProps
  extends IBaseContentContainerProps {
  readOnly: true;
  editMode: EditMode.Disabled;
}

export interface IReadWriteContentContainerProps
  extends IBaseContentContainerProps {
  dataVersionAtBeginning?: number;
  getClassFocus: (className: string) => IClassFocus;
  onAddColumnClick: () => void;
  onCancelTransaction: () => void;
  onCommitTransaction: () => void;
  onRealmChanged: () => void;
  readOnly: false;
  realm: Realm;
}

export type IContentContainerProps =
  | IReadOnlyContentContainerProps
  | IReadWriteContentContainerProps;

export interface IContentContainerState {
  createObjectDialog: ICreateObjectDialogContainerProps;
  deleteObjectsDialog: IDeleteObjectsDialogProps;
  error?: Error;
  highlight?: IHighlight;
  query: string;
  selectObjectDialog: ISelectObjectDialog;
  sorting?: ISorting;
}

class ContentContainer extends React.Component<
  IContentContainerProps,
  IContentContainerState
> {
  // TODO: Reset sorting, highlight and filtering (and scroll) when focus change

  public state: IContentContainerState = {
    createObjectDialog: { isOpen: false },
    deleteObjectsDialog: { isOpen: false },
    query: '',
    selectObjectDialog: { isOpen: false },
  };

  public latestCellValidation?: {
    columnIndex: number;
    rowIndex: number;
    valid: boolean;
  };

  private clickTimeout?: any;
  private filteredSortedResults = memoize(
    (results: Realm.Collection<any>, query: string, sorting?: ISorting) => {
      if (query) {
        try {
          results = results.filtered(query);
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.warn(`Could not filter on "${query}"`, err);
        }
      }
      if (sorting) {
        const propertyName = sorting.property.name;
        if (propertyName) {
          results = results.sorted(propertyName, sorting.reverse);
        }
      }
      return results;
    },
  );
  private lastRowIndexClicked?: number;

  public componentDidUpdate(
    prevProps: IContentContainerProps,
    prevState: IContentContainerState,
  ) {
    if (
      this.state.query !== prevState.query ||
      this.state.sorting !== prevState.sorting
    ) {
      this.onResetHighlight();
    }
  }

  public componentDidCatch(error: Error) {
    this.setState({ error });
  }

  public render() {
    const props = this.getProps();
    return <Content {...props} />;
  }

  public highlightObject(object: Realm.Object) {
    const highlight = this.generateHighlight(object);
    this.setState({ highlight });
  }

  private getProps(): IContentProps {
    const filteredSortedResults = this.filteredSortedResults(
      this.props.focus.results,
      this.state.query,
      this.state.sorting,
    );
    const common = {
      dataVersion: this.props.dataVersion,
      error: this.state.error,
      filteredSortedResults,
      focus: this.props.focus,
      highlight: this.state.highlight,
      onCellChange: this.onCellChange,
      onCellClick: this.onCellClick,
      onCellHighlighted: this.onCellHighlighted,
      onCellValidated: this.onCellValidated,
      onContextMenu: this.onContextMenu,
      onNewObjectClick: this.onNewObjectClick,
      onQueryChange: this.onQueryChange,
      onQueryHelp: this.onQueryHelp,
      onResetHighlight: this.onResetHighlight,
      onSortingChange: this.onSortingChange,
      onTableBackgroundClick: this.onTableBackgroundClick,
      query: this.state.query,
      sorting: this.state.sorting,
    };
    if (this.props.readOnly) {
      return {
        ...common,
        editMode: EditMode.Disabled,
        readOnly: true,
      };
    } else {
      const { dataVersion = 0, dataVersionAtBeginning = 0 } = this.props;
      return {
        ...common,
        changeCount: dataVersion - dataVersionAtBeginning,
        createObjectDialog: this.state.createObjectDialog,
        deleteObjectsDialog: this.state.deleteObjectsDialog,
        editMode: this.props.editMode,
        getClassFocus: this.props.getClassFocus,
        inTransaction: this.props.realm.isInTransaction,
        onAddColumnClick: this.props.onAddColumnClick,
        onCancelTransaction: this.props.onCancelTransaction,
        onCommitTransaction: this.props.onCommitTransaction,
        onReorderingEnd: this.onReorderingEnd,
        onReorderingStart: this.onReorderingStart,
        readOnly: false,
        selectObjectDialog: this.state.selectObjectDialog,
      };
    }
  }

  private onCancelCreateObjectDialog = () => {
    this.setState({ createObjectDialog: { isOpen: false } });
  };

  private onCancelDeleteObjectsDialog = () => {
    this.setState({ deleteObjectsDialog: { isOpen: false } });
  };

  private onCancelSelectObjectDialog = () => {
    this.setState({ selectObjectDialog: { isOpen: false } });
  };

  private onQueryChange = (query: string) => {
    this.setState({ query });
  };

  private onQueryHelp = () => {
    const url =
      'https://realm.io/docs/javascript/latest/api/tutorial-query-language.html';
    electron.shell.openExternal(url);
  };

  private onResetHighlight = () => {
    this.setState({ highlight: undefined });
  };

  private onSortingChange: SortingChangeHandler = sorting => {
    this.setState({ sorting });
  };

  private onTableBackgroundClick = () => {
    // When clicking outside a cell. Reset the highlight.
    this.onResetHighlight();
  };

  private generateHighlight(
    object: Realm.Object,
    scrollToObject: boolean = true,
  ): IHighlight {
    const filteredSortedResults = this.filteredSortedResults(
      this.props.focus.results,
      this.state.query,
      this.state.sorting,
    );
    const index = filteredSortedResults.indexOf(object);
    const result: IHighlight = {
      rows: new Set(index > -1 ? [index] : []),
    };
    if (scrollToObject) {
      result.scrollTo = {
        center: true,
        row: index,
      };
    }
    return result;
  }

  private onCellChange: CellChangeHandler = params => {
    try {
      this.write(() => {
        const { parent, property, rowIndex, cellValue } = params;
        if (property.name !== null) {
          parent[rowIndex][property.name] = cellValue;
        } else {
          parent[rowIndex] = cellValue;
        }
      });
    } catch (err) {
      showError('Failed when saving the value', err);
    }
  };

  private onObjectSelect = (object: any) => {
    if (this.state.selectObjectDialog.isOpen) {
      const { action } = this.state.selectObjectDialog;
      this.write(() => {
        if (action.type === 'list') {
          action.list.push(object);
        } else if (action.type === 'object') {
          // { [p: string]: any } is needed bacause of a Realm JS type issue
          const parent: { [p: string]: any } = action.object;
          parent[action.propertyName] = object;
        }
        // Close the dialog
        this.setState({ selectObjectDialog: { isOpen: false } });
      });
    }
  };

  private onCellClick: CellClickHandler = (params, e) => {
    if (this.props.onCellClick) {
      this.props.onCellClick(params, e);
    } else {
      const { rowObject, property, cellValue, rowIndex, columnIndex } = params;

      const shiftClick = e && e.shiftKey;
      const metaClick = e && e.metaKey; // Command key in MacOs

      const currentRowReferenceShiftClick =
        this.state.highlight && this.lastRowIndexClicked;
      const clickWhenNoRowHighlighted =
        currentRowReferenceShiftClick === undefined;
      const normalClick = !shiftClick && !metaClick;
      const nextRowReferenceShiftClick =
        clickWhenNoRowHighlighted || normalClick || metaClick
          ? rowIndex
          : currentRowReferenceShiftClick;

      const nextRowsHighlighted =
        this.state.highlight && this.state.highlight.rows
          ? new Set(this.state.highlight.rows)
          : new Set();

      if (metaClick) {
        // Unselect the row when It was already selected otherwise select it
        if (nextRowsHighlighted.has(rowIndex)) {
          nextRowsHighlighted.delete(rowIndex);
        } else {
          nextRowsHighlighted.add(rowIndex);
        }
      } else if (shiftClick) {
        // Select all the rows from the row previously referenced to the last row clicked
        if (nextRowReferenceShiftClick !== undefined) {
          const rowIndexRange = getRange(nextRowReferenceShiftClick, rowIndex);
          for (const i of rowIndexRange) {
            nextRowsHighlighted.add(i);
          }
        }
      } else {
        nextRowsHighlighted.clear();
        nextRowsHighlighted.add(rowIndex);
      }

      if (!this.latestCellValidation || this.latestCellValidation.valid) {
        // Ensuring that the last cell validation didn't fail
        if (this.clickTimeout) {
          clearTimeout(this.clickTimeout);
          this.onCellDoubleClick(rowObject, property, cellValue);
          this.clickTimeout = null;
        } else {
          this.clickTimeout = setTimeout(() => {
            this.onCellSingleClick(rowObject, property, cellValue);
            this.clickTimeout = null;
          }, 200);
        }

        this.setState(
          {
            highlight: {
              rows: nextRowsHighlighted,
              scrollTo: {
                column: columnIndex,
                row: rowIndex,
              },
            },
          },
          () => {
            this.lastRowIndexClicked = rowIndex;
          },
        );
      }
    }
  };

  private onCellSingleClick = (
    object: any,
    property?: IPropertyWithName,
    value?: any,
  ) => {
    if (property && property.type === 'list' && this.props.onListFocussed) {
      this.props.onListFocussed(object, property);
    } else if (
      property &&
      property.type === 'object' &&
      property.objectType &&
      value &&
      this.props.onClassFocussed
    ) {
      this.props.onClassFocussed(property.objectType, value);
    }
  };

  private onCellDoubleClick = (
    object: any,
    property?: IPropertyWithName,
    value?: any,
  ) => {
    if (
      property &&
      property.type === 'object' &&
      property.name &&
      property.objectType
    ) {
      this.onShowSelectObjectDialog({
        action: { type: 'object', object, propertyName: property.name },
        className: property.objectType,
        isOptional: property.optional,
      });
    }
  };

  private onCellHighlighted: CellHighlightedHandler = ({
    rowIndex,
    columnIndex,
  }) => {
    if (!this.latestCellValidation || this.latestCellValidation.valid) {
      this.setState({
        highlight: {
          rows: new Set([rowIndex]),
          column: columnIndex,
          lastRowIndexClicked: rowIndex,
        },
      });
    }
  };

  private onCellValidated: CellValidatedHandler = (
    rowIndex,
    columnIndex,
    valid,
  ) => {
    this.latestCellValidation = {
      columnIndex,
      rowIndex,
      valid,
    };
  };

  private onContextMenu: CellContextMenuHandler = (
    e: React.MouseEvent<any>,
    params,
  ) => {
    e.preventDefault();
    const { focus } = this.props;
    const { Menu, MenuItem } = electron.remote;

    const contextMenu = new Menu();

    if (params) {
      const { property, rowObject, rowIndex, columnIndex } = params;

      // If the clicked row was not highlighted - highlight only that
      if (!this.state.highlight || !this.state.highlight.rows.has(rowIndex)) {
        this.onCellHighlighted({ rowIndex, columnIndex });
        // Wait 200ms to allow the state to update and call recursively
        window.setTimeout(() => {
          return this.onContextMenu(e, params);
        }, 200);
        return;
      }

      // If we clicked a property that refers to an object
      if (property && property.type === 'object') {
        contextMenu.append(
          new MenuItem({
            label: 'Update reference',
            click: () => {
              if (property.objectType && property.name) {
                this.onShowSelectObjectDialog({
                  action: {
                    type: 'object',
                    object: rowObject,
                    propertyName: property.name,
                  },
                  className: property.objectType,
                  isOptional: property.optional,
                });
              }
            },
          }),
        );
      }

      // If we have one or more rows highlighted - we can delete those
      if (focus && this.state.highlight && this.state.highlight.rows.size > 0) {
        const { label, title, description } = this.generateDeleteTexts(
          focus,
          this.state.highlight.rows.size > 1,
        );

        contextMenu.append(
          new MenuItem({
            label,
            click: () => {
              if (this.state.highlight) {
                // Clear the highlight before deleting the objects
                this.onShowDeleteObjectDialog(
                  title,
                  description,
                  label,
                  this.state.highlight.rows,
                );
              }
            },
          }),
        );
      }
    }

    // If we right-clicking on the content we can add an existing object when we are focusing an object list
    if (
      focus &&
      focus.kind === 'list' &&
      focus.property.objectType &&
      !isPrimitive(focus.property.objectType)
    ) {
      const className = getClassName(focus);
      contextMenu.append(
        new MenuItem({
          label: `Add existing ${className}`,
          click: () => {
            if (focus.property.objectType) {
              this.onShowSelectObjectDialog({
                action: {
                  type: 'list',
                  list: focus.results,
                },
                className: focus.property.objectType,
              });
            }
          },
        }),
      );
    }

    // If we right-clicking on the content we can always create a new object
    if (focus) {
      const className = getClassName(focus);
      contextMenu.append(
        new MenuItem({
          label: `Create new ${className}`,
          click: () => {
            this.onShowCreateObjectDialog(className);
          },
        }),
      );
    }

    // If we have items to show - popup the menu
    if (contextMenu.items.length > 0) {
      contextMenu.popup(electron.remote.getCurrentWindow(), {
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  private onShowCreateObjectDialog = (className: string) => {
    if (!this.props.readOnly) {
      const schema =
        className && isPrimitive(className)
          ? {
              name: className,
              properties: {
                [className]: {
                  type: className,
                },
              },
            }
          : this.props.realm.schema.find(s => s.name === className);
      if (schema) {
        this.setState({
          createObjectDialog: {
            getClassFocus: this.props.getClassFocus,
            isOpen: true,
            onCancel: this.onCancelCreateObjectDialog,
            onCreate: this.onCreateObject,
            schema,
          },
        });
      }
    }
  };

  private onShowDeleteObjectDialog = (
    title: string,
    description: string,
    actionLabel: string,
    rows: Set<number>,
  ) => {
    this.setState({
      deleteObjectsDialog: {
        actionLabel,
        title,
        description,
        isOpen: true,
        onCancel: this.onCancelDeleteObjectsDialog,
        onDelete: () => {
          this.deleteObjects(rows);
          this.setState({
            // Deleting objects will messup the highlight
            highlight: undefined,
            deleteObjectsDialog: { isOpen: false },
          });
        },
      },
    });
  };

  private onCreateObject: CreateObjectHandler = (
    className: string,
    values: {},
  ) => {
    if (!this.props.readOnly) {
      const { focus, realm } = this.props;
      let rowIndex = -1;

      this.write(() => {
        // Writing makes no sense if the realm was not loaded
        if (realm) {
          // Adding a primitive value into a list
          if (isPrimitive(className)) {
            if (focus && focus.kind === 'list') {
              const valueToPush = (values as any)[className];
              focus.results.push(valueToPush);
              rowIndex = focus.results.indexOf(valueToPush);
            }
          } else {
            // Adding a new object into a class
            const object = realm.create(className, values);
            if (focus) {
              // New object has been created from a list, so we add it too into the list
              if (focus.kind === 'list') {
                focus.results.push(object);
              }
              if (getClassName(focus) === className) {
                rowIndex = focus.results.indexOf(object);
              }
            }
          }

          this.setState({
            createObjectDialog: { isOpen: false },
            highlight: {
              rows: new Set(rowIndex >= 0 ? [rowIndex] : []),
              scrollTo: {
                row: rowIndex,
              },
            },
          });
        } else {
          throw new Error('onCreateObject called before realm was loaded');
        }
      });
    }
  };

  private onNewObjectClick = () => {
    const className = getClassName(this.props.focus);
    this.onShowCreateObjectDialog(className);
  };

  private onReorderingStart: ReorderingStartHandler = () => {
    // Removing any highlight
    this.setState({ highlight: undefined });
  };

  private onReorderingEnd: ReorderingEndHandler = ({ oldIndex, newIndex }) => {
    if (this.props.focus.kind === 'list') {
      const results = (this.props.focus.results as any) as Realm.List<any>;
      this.write(() => {
        const movedElements = results.splice(oldIndex, 1);
        results.splice(newIndex, 0, movedElements[0]);
      });
    }
    this.setState({
      highlight: {
        ...this.state.highlight,
        rows: new Set([newIndex]),
      },
    });
  };

  private onShowSelectObjectDialog({
    className,
    isOptional = false,
    action,
  }: {
    className: string;
    isOptional?: boolean;
    action: SelectObjectAction;
  }) {
    if (!this.props.readOnly) {
      const focus: IClassFocus = this.props.getClassFocus(className);
      this.setState({
        selectObjectDialog: {
          action,
          focus,
          isOpen: true,
          isOptional,
          onCancel: this.onCancelSelectObjectDialog,
          onSelect: this.onObjectSelect,
        },
      });
    }
  }

  private deleteObjects(rowIndecies: Set<number>) {
    if (!this.props.readOnly) {
      try {
        const { focus, realm } = this.props;

        this.write(() => {
          const objects = this.getHighlightedObjects(rowIndecies);
          if (realm && focus.kind === 'class') {
            for (const object of objects) {
              realm.delete(object);
            }
          } else if (focus.kind === 'list') {
            // Creating a list of the indecies of the objects in the original (unfiltered, unsorted) list
            const listIndecies: number[] = [];
            for (const object of objects) {
              const index = focus.results.indexOf(object);
              listIndecies.push(index);
            }
            // Sort and reverse, in-place
            listIndecies.sort((a, b) => a - b).reverse();
            // Remove these objects from the list one by one - starting from the bottom
            for (const index of listIndecies) {
              focus.results.splice(index, 1);
            }
          }
        });
      } catch (err) {
        showError('Error deleting the object', err);
      }
    }
  }

  private getHighlightedObjects(rowIndecies: Set<number>) {
    const filteredSortedResults = this.filteredSortedResults(
      this.props.focus.results,
      this.state.query,
      this.state.sorting,
    );
    const result = new Set<Realm.Object>();
    for (const index of rowIndecies) {
      const object = filteredSortedResults[index];
      result.add(object);
    }
    return result;
  }

  private generateDeleteTexts(focus: Focus, multiple: boolean) {
    if (focus.kind === 'list') {
      if (multiple) {
        return {
          label: 'Remove selected rows from the list',
          title: 'Removing rows',
          description:
            'Are you sure you want to remove these rows from the list?',
        };
      } else {
        return {
          label: 'Remove selected row from the list',
          title: 'Removing row',
          description:
            'Are you sure you want to remove this row from the list?',
        };
      }
    } else {
      if (multiple) {
        return {
          label: 'Delete selected objects',
          title: 'Delete objects',
          description: 'Are you sure you want to delete these objects?',
        };
      } else {
        return {
          label: 'Delete selected object',
          title: 'Delete object',
          description: 'Are you sure you want to delete this object?',
        };
      }
    }
  }

  private write(callback: () => void) {
    if (!this.props.readOnly) {
      if (this.props.realm.isInTransaction) {
        callback();
        // We have to signal changes manually
        this.props.onRealmChanged();
      } else {
        this.props.realm.write(callback);
      }
    }
  }
}

export { ContentContainer as Content };

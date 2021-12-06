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

import electron from 'electron';
import * as remote from '@electron/remote';
import memoize from 'memoize-one';
import React from 'react';
import Realm from 'realm';

import {
  ClassFocussedHandler,
  IPropertyWithName,
  ListFocussedHandler,
  IsEmbeddedTypeChecker,
  SingleListFocussedHandler,
  JsonViewerDialogExecutor,
} from '..';
import { store } from '../../../store';
import { getRange } from '../../../utils';
import { canUseJsonViewer } from '../../../utils/json';
import { showError } from '../../reusable/errors';
import { ILoadingProgress } from '../../reusable/LoadingOverlay';
import { Focus, getClassName, IClassFocus } from '../focus';
import { isPrimitive } from '../primitives';

import { Content, IContentProps } from './Content';
import { ICreateObjectDialogContainerProps } from './CreateObjectDialog';
import { IDeleteObjectsDialogProps } from './DeleteObjectsDialog';
import {
  IOpenSelectMultipleObjectsDialogContainerProps,
  IOpenSelectSingleObjectDialogContainerProps,
} from './SelectObjectDialog';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  ReorderingEndHandler,
  ReorderingStartHandler,
  rowHeights,
  RowMouseDownHandler,
} from './Table';

export enum EditMode {
  Disabled = 'disabled',
  InputBlur = 'input-blur',
  KeyPress = 'key-press',
}

export enum HighlightMode {
  Disabled = 'disabled',
  Single = 'single',
  Multiple = 'multiple',
}

export type EmbeddedInfo = {
  parent: Realm.Object & { [key: string]: any };
  key: string;
};
export type CreateObjectHandler = (
  className: string,
  values: Record<string, unknown>,
  embeddedInfo?: EmbeddedInfo,
) => void;
export type QueryChangeHandler = (query: string) => void;
export type SortingChangeHandler = (sorting: ISorting | undefined) => void;

export interface ISorting {
  property: IPropertyWithName;
  reverse: boolean;
}

export type SelectObjectAction =
  | { type: 'object'; object: Realm.Object; propertyName: string }
  | { type: 'list'; list: Realm.List<any> };

export interface ISelectObjectForObjectDialog
  extends IOpenSelectSingleObjectDialogContainerProps {
  action: 'object';
  isOpen: true;
  multiple: false;
  object: Realm.Object;
  propertyName: string;
}

export interface ISelectObjectsForListDialog
  extends IOpenSelectMultipleObjectsDialogContainerProps {
  action: 'list';
  isOpen: true;
  list: Realm.List<any>;
  multiple: true;
}

export type ISelectObjectDialog =
  | ISelectObjectForObjectDialog
  | ISelectObjectsForListDialog
  | { isOpen: false };

export interface IBaseContentContainerProps {
  dataVersion?: number;
  allowCreate: boolean;
  editMode: EditMode;
  focus: Focus;
  highlightMode: HighlightMode;
  onCellClick?: CellClickHandler;
  onCellDoubleClick?: CellClickHandler;
  onCellSingleClick?: CellClickHandler;
  onClassFocussed?: ClassFocussedHandler;
  onHighlightChange?: (
    highlight: IHighlight | undefined,
    collection: Realm.Collection<any>,
  ) => void;
  onListFocussed?: ListFocussedHandler;
  onSingleListFocussed?: SingleListFocussedHandler;
  onShowJsonViewerDialog: (value: unknown) => void; // TODO: reuse from... elsewhere
  progress?: ILoadingProgress;
  readOnly: boolean;
  isEmbeddedType: IsEmbeddedTypeChecker;
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
  permissionSidebar: boolean;
  readOnly: boolean;
  realm: Realm;
}

export type IContentContainerProps =
  | IReadOnlyContentContainerProps
  | IReadWriteContentContainerProps;

export interface IContentContainerState {
  createObjectDialog: ICreateObjectDialogContainerProps;
  deleteObjectsDialog: IDeleteObjectsDialogProps;
  error?: Error;
  hideSystemClasses: boolean;
  highlight?: IHighlight;
  isPermissionSidebarOpen: boolean;
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
    hideSystemClasses: !store.shouldShowSystemClasses(),
    isPermissionSidebarOpen:
      !this.props.readOnly && this.props.permissionSidebar,
    query: '',
    selectObjectDialog: { isOpen: false },
  };

  public latestCellValidation?: {
    columnIndex: number;
    rowIndex: number;
    valid: boolean;
  };

  private removeStoreListener: (() => void) | null = null;

  private clickTimeout?: any;
  private filteredSortedResults = memoize(
    (results: Realm.Collection<any>, query: string, sorting?: ISorting) => {
      let filterError: Error | undefined;
      if (query) {
        try {
          results = results.filtered(query);
        } catch (err) {
          filterError =
            err instanceof Error ? err : new Error('Expected an Error');
        }
      }
      if (sorting) {
        const propertyName = sorting.property.name;
        if (propertyName) {
          results = results.sorted(propertyName, sorting.reverse);
        }
      }
      return { results, filterError };
    },
  );

  private filteredProperties = memoize(
    (properties: IPropertyWithName[], hideSystemClasses: boolean) => {
      if (hideSystemClasses) {
        return properties.filter(
          p => !(p.objectType && p.objectType.startsWith('__')),
        );
      } else {
        return properties;
      }
    },
  );

  private contentElement: HTMLElement | null = null;
  // Used to save the initial vertical coordinate when the user starts dragging to select rows
  private rowDragStart: { offset: number; rowIndex: number } | undefined;

  public componentDidUpdate(
    prevProps: IContentContainerProps,
    prevState: IContentContainerState,
  ) {
    if (
      this.state.query !== prevState.query ||
      this.state.sorting !== prevState.sorting
    ) {
      this.onResetHighlight();
    } else if (
      this.props.onHighlightChange &&
      this.state.highlight !== prevState.highlight
    ) {
      const { results } = this.filteredSortedResults(
        this.props.focus.results,
        this.state.query,
        this.state.sorting,
      );
      this.props.onHighlightChange(this.state.highlight, results);
    }
  }

  public componentDidCatch(error: Error) {
    // Add some more explanation to some error messages
    if (error.message === 'Access to invalidated List object') {
      error.message = 'The parent object with the list got deleted';
    }
    this.setState({ error });
  }

  public componentWillMount() {
    this.removeStoreListener = store.onDidChange(
      store.KEY_SHOW_SYSTEM_CLASSES,
      showSystemClasses =>
        this.setState({ hideSystemClasses: !showSystemClasses }),
    );
  }

  public componentWillUnmount() {
    document.removeEventListener('mouseup', this.onRowMouseUp);
    if (this.removeStoreListener) {
      this.removeStoreListener();
    }
  }

  public render() {
    const props = this.getProps();
    return <Content {...props} />;
  }

  public highlightObject(object: Realm.Object | null) {
    const highlight = this.generateHighlight(object);
    this.setState({ highlight });
  }

  private contentRef = (element: HTMLElement | null) => {
    this.contentElement = element;
  };

  private getProps(): IContentProps {
    const { results, filterError } = this.filteredSortedResults(
      this.props.focus.results,
      this.state.query,
      this.state.sorting,
    );
    const focus: Focus = {
      ...this.props.focus,
      properties: this.filteredProperties(
        this.props.focus.properties,
        this.state.hideSystemClasses,
      ),
    };
    const common = {
      contentRef: this.contentRef,
      dataVersion: this.props.dataVersion,
      error: this.state.error,
      filteredSortedResults: results,
      focus,
      highlight: this.state.highlight,
      isPermissionSidebarOpen: this.state.isPermissionSidebarOpen,
      onCellChange: this.onCellChange,
      onCellClick: this.onCellClick,
      onCellHighlighted: this.onCellHighlighted,
      onCellValidated: this.onCellValidated,
      onContextMenu: this.onContextMenu,
      onRowMouseDown: this.onRowMouseDown,
      onNewObjectClick: this.onNewObjectClick,
      onQueryChange: this.onQueryChange,
      onQueryHelp: this.onQueryHelp,
      onResetHighlight: this.onResetHighlight,
      onSortingChange: this.onSortingChange,
      query: this.state.query,
      queryError: filterError,
      sorting: this.state.sorting,
    };
    if (this.props.readOnly) {
      return {
        ...common,
        editMode: EditMode.Disabled,
        readOnly: true,
        allowCreate: this.props.allowCreate,
      };
    } else {
      const { dataVersion = 0, dataVersionAtBeginning = 0 } = this.props;
      return {
        ...common,
        changeCount: dataVersion - dataVersionAtBeginning,
        createObjectDialog: this.state.createObjectDialog,
        deleteObjectsDialog: this.state.deleteObjectsDialog,
        allowCreate: this.props.allowCreate,
        editMode: this.props.editMode,
        getClassFocus: this.props.getClassFocus,
        inTransaction: this.props.realm.isInTransaction,
        onAddColumnClick: this.props.onAddColumnClick,
        onCancelTransaction: this.props.onCancelTransaction,
        onCommitTransaction: this.props.onCommitTransaction,
        onPermissionSidebarToggle: this.props.permissionSidebar
          ? this.onPermissionSidebarToggle
          : undefined,
        onReorderingEnd: this.onReorderingEnd,
        onReorderingStart: this.onReorderingStart,
        realm: this.props.realm,
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

  private generateHighlight(
    object: Realm.Object | null,
    scrollToObject = true,
  ): IHighlight {
    if (object) {
      const { results } = this.filteredSortedResults(
        this.props.focus.results,
        this.state.query,
        this.state.sorting,
      );
      const index = results.indexOf(object);
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
    } else {
      return { rows: new Set() };
    }
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

  private onObjectSelect = (
    selectedObjects: Realm.Object | Realm.Object[] | null,
  ) => {
    if (this.state.selectObjectDialog.isOpen) {
      const { selectObjectDialog } = this.state;
      this.write(() => {
        if (
          selectObjectDialog.action === 'list' &&
          Array.isArray(selectedObjects)
        ) {
          selectObjectDialog.list.push(...selectedObjects);
        } else if (
          selectObjectDialog.action === 'object' &&
          !Array.isArray(selectedObjects)
        ) {
          // { [p: string]: any } is needed bacause of a Realm JS type issue
          const parent: { [p: string]: any } = selectObjectDialog.object;
          parent[selectObjectDialog.propertyName] = selectedObjects;
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
      if (!this.latestCellValidation || this.latestCellValidation.valid) {
        // Ensuring that the last cell validation didn't fail
        if (this.clickTimeout) {
          clearTimeout(this.clickTimeout);
          this.onCellDoubleClick(params, e);
          this.clickTimeout = null;
        } else {
          this.clickTimeout = setTimeout(() => {
            this.onCellSingleClick(params, e);
            this.clickTimeout = null;
          }, 200);
        }
      }
    }
  };

  private onCellSingleClick: CellClickHandler = (params, e) => {
    if (this.props.onCellSingleClick) {
      this.props.onCellSingleClick(params, e);
    } else {
      const { property, rowObject, cellValue } = params;
      if (!property) return;

      if (
        canUseJsonViewer(property, cellValue) &&
        this.props.onShowJsonViewerDialog
      ) {
        this.props.onShowJsonViewerDialog(cellValue);
      } else if (property.type === 'list' && this.props.onListFocussed) {
        this.props.onListFocussed(rowObject, property);
      } else if (
        property.type === 'object' &&
        property.objectType &&
        (cellValue || property.isEmbedded) &&
        this.props.onClassFocussed
      ) {
        // Handle Embedded Objects
        if (property.isEmbedded) {
          if (cellValue === null && property.name && property.objectType) {
            this.onShowCreateObjectDialog(property.objectType, {
              key: property.name,
              parent: rowObject,
            });
          } else if (this.props.onSingleListFocussed) {
            this.props.onSingleListFocussed(rowObject, property);
          }
        } else {
          this.props.onClassFocussed(property.objectType, cellValue);
        }
      }
    }
  };

  private onCellDoubleClick: CellClickHandler = (params, e) => {
    if (this.props.onCellDoubleClick) {
      this.props.onCellDoubleClick(params, e);
    } else {
      const { property, rowObject } = params;
      if (
        property &&
        property.type === 'object' &&
        property.name &&
        property.objectType &&
        !property.isEmbedded
      ) {
        this.onShowSelectObjectDialog({
          action: {
            type: 'object',
            object: rowObject,
            propertyName: property.name,
          },
          className: property.objectType,
          isOptional: property.optional,
          isEmbeddedType: this.props.isEmbeddedType,
          onShowJsonViewerDialog: this.props.onShowJsonViewerDialog,
        });
      }
    }
  };

  private onCellHighlighted: CellHighlightedHandler = ({
    rowIndex,
    columnIndex,
  }) => {
    this.setState({
      highlight: {
        rows: new Set([rowIndex]),
        scrollTo: {
          column: columnIndex,
          row: rowIndex,
        },
      },
    });
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
    const { allowCreate, focus, readOnly } = this.props;
    const { Menu, MenuItem } = remote;

    const contextMenu = new Menu();

    if (params) {
      const { property, rowObject } = params;
      // If we clicked a property that refers to an object
      if (
        !readOnly &&
        property &&
        property.type === 'object' &&
        property.isEmbedded !== true
      ) {
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
                  isEmbeddedType: this.props.isEmbeddedType,
                  onShowJsonViewerDialog: this.props.onShowJsonViewerDialog,
                });
              }
            },
          }),
        );
      }

      // If we have one or more rows highlighted - we can delete those
      if (
        !readOnly &&
        focus &&
        this.state.highlight &&
        this.state.highlight.rows.size > 0
      ) {
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
      !readOnly &&
      focus &&
      focus.kind === 'list' &&
      focus.property.objectType &&
      !isPrimitive(focus.property.objectType) &&
      !focus.property.isEmbedded
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
                isEmbeddedType: this.props.isEmbeddedType,
                onShowJsonViewerDialog: this.props.onShowJsonViewerDialog,
              });
            }
          },
        }),
      );
    }

    // If we right-clicking on the content we can always create a new object
    if (allowCreate && !readOnly && focus) {
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
      contextMenu.popup({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  private onShowCreateObjectDialog = (
    className: string,
    embeddedInfo?: EmbeddedInfo,
  ) => {
    if (!this.props.readOnly) {
      const { realm, getClassFocus, isEmbeddedType } = this.props;
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
          : realm.schema.find(s => s.name === className);
      if (schema) {
        this.setState({
          createObjectDialog: {
            getClassFocus,
            isOpen: true,
            onCancel: this.onCancelCreateObjectDialog,
            onCreate: this.onCreateObject,
            schema,
            isEmbeddedType,
            embeddedInfo,
            onShowJsonViewerDialog: this.props.onShowJsonViewerDialog,
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
            // Deleting objects will mess up the highlight
            highlight: undefined,
            deleteObjectsDialog: { isOpen: false },
          });
        },
      },
    });
  };

  private onCreateObject: CreateObjectHandler = (
    className: string,
    values: Record<string, unknown>,
    embeddedInfo?: EmbeddedInfo,
  ) => {
    if (!this.props.readOnly) {
      const { focus, realm } = this.props;
      let rowIndex = -1;

      this.write(() => {
        // Writing makes no sense if the realm was not loaded
        if (realm) {
          if (embeddedInfo) {
            const { parent, key } = embeddedInfo;

            if (focus && focus.kind === 'list') {
              // Using this method as instanceof Realm.List is not currently valid
              if (typeof parent[key].push === 'function') {
                parent[key].push(values);
              }
            } else {
              parent[key] = values;
            }
          } else if (isPrimitive(className)) {
            // Adding a primitive value into a list
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

  private onRowMouseDown: RowMouseDownHandler = (e, rowIndex) => {
    // Prevent the content grid from being clicked
    e.stopPropagation();
    const { highlightMode, focus } = this.props;
    const { highlight } = this.state;
    if (this.contentElement && highlightMode === HighlightMode.Multiple) {
      // Create a mutation friendly version of the set of row indices currently highlighted
      const rows = highlight ? new Set(highlight.rows) : new Set<number>();
      // This is a left click with the meta-key (command on Mac) pressed
      if (e.button === 0 && e.metaKey) {
        // The user wants to add or remove a row to the current selection
        if (rows.has(rowIndex)) {
          rows.delete(rowIndex);
        } else {
          rows.add(rowIndex);
        }
        this.setState({
          highlight: { rows },
        });
      } else if (e.button === 0 && e.shiftKey) {
        // The user wants to select since the previous selection
        if (this.rowDragStart !== undefined) {
          const rowIndexRange = getRange(this.rowDragStart.rowIndex, rowIndex);
          for (const i of rowIndexRange) {
            rows.add(i);
          }
        }
        this.setState({ highlight: { rows } });
      } else if (e.button === 0 && focus.kind !== 'list') {
        // The user left-clicked on a non-list row
        this.contentElement.addEventListener('mousemove', this.onRowMouseMove);
        document.addEventListener('mouseup', this.onRowMouseUp);
        const rect = e.currentTarget.getBoundingClientRect();
        this.rowDragStart = {
          offset: rect.top,
          rowIndex,
        };
        // Highlight the row
        this.setState({ highlight: { rows: new Set([rowIndex]) } });
      } else if (e.button === 0 && focus.kind === 'list') {
        // The user left-clicked on a list row - highlight it
        this.setState({ highlight: { rows: new Set([rowIndex]) } });
      } else if (e.button === 2 && rows.size === 0) {
        // Right clicked when nothing was highlighted:
        // Select the row but don't start a drag
        this.setState({ highlight: { rows: new Set([rowIndex]) } });
      }
    } else if (highlightMode === HighlightMode.Single) {
      this.setState({ highlight: { rows: new Set([rowIndex]) } });
    }
  };

  private onRowMouseUp = () => {
    // If the table element is known, remove the move listener from it
    if (this.contentElement) {
      this.contentElement.removeEventListener('mousemove', this.onRowMouseMove);
    }
  };

  private onRowMouseMove = (e: MouseEvent) => {
    if (this.rowDragStart) {
      const { offset, rowIndex } = this.rowDragStart;
      const offsetRelative = e.clientY - offset;
      const offsetIndex = Math.floor(offsetRelative / rowHeights.content);
      const hoveredIndex = rowIndex + offsetIndex;
      // Compute the set of highlighted row indices
      const minIndex = Math.min(rowIndex, hoveredIndex);
      const maxIndex = Math.max(rowIndex, hoveredIndex);
      const rows = new Set<number>();
      for (let i = minIndex; i <= maxIndex; i++) {
        rows.add(i);
      }
      // Highlight the rows
      this.setState({ highlight: { rows } });
    }
  };

  private onNewObjectClick = () => {
    const { focus } = this.props;
    const className = getClassName(this.props.focus);

    const embeddedInfo: EmbeddedInfo | undefined =
      focus.isEmbedded && focus.kind === 'list' && focus.property.name
        ? {
            parent: focus.parent,
            key: focus.property.name,
          }
        : undefined;

    this.onShowCreateObjectDialog(className, embeddedInfo);
  };

  private onPermissionSidebarToggle = () => {
    this.setState({
      isPermissionSidebarOpen: !this.state.isPermissionSidebarOpen,
    });
  };

  private onReorderingStart: ReorderingStartHandler = () => {
    // Removing any highlight
    this.setState({ highlight: undefined });
  };

  private onReorderingEnd: ReorderingEndHandler = ({ oldIndex, newIndex }) => {
    const { focus } = this.props;
    if (focus.kind === 'list') {
      this.write(() => {
        // For embedded objects, we have to work on detached objects, as we otherwise
        // delete the moved object (not sure if this is best practice).
        if (focus.isEmbedded && focus.property.name) {
          const detached = focus.results.toJSON();

          const removed = detached.splice(oldIndex, 1);
          detached.splice(newIndex, 0, removed[0]);

          focus.parent[focus.property.name] = detached;
        } else {
          const removed = focus.results.splice(oldIndex, 1);
          focus.results.splice(newIndex, 0, removed[0]);
        }
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
    isEmbeddedType,
  }: {
    className: string;
    isOptional?: boolean;
    action: SelectObjectAction;
    isEmbeddedType: IsEmbeddedTypeChecker;
    onShowJsonViewerDialog: JsonViewerDialogExecutor;
  }) {
    if (!this.props.readOnly) {
      const focus: IClassFocus = this.props.getClassFocus(className);
      if (action.type === 'object') {
        const selectObjectDialog: ISelectObjectForObjectDialog = {
          action: 'object',
          focus,
          isOpen: true,
          isOptional,
          multiple: false,
          object: action.object,
          onCancel: this.onCancelSelectObjectDialog,
          onSelect: this.onObjectSelect,
          propertyName: action.propertyName,
          isEmbeddedType,
          onShowJsonViewerDialog: this.props.onShowJsonViewerDialog,
        };
        this.setState({ selectObjectDialog });
      } else {
        const selectObjectDialog: ISelectObjectsForListDialog = {
          action: 'list',
          focus,
          isOpen: true,
          isOptional,
          list: action.list,
          multiple: true,
          onCancel: this.onCancelSelectObjectDialog,
          onSelect: this.onObjectSelect,
          isEmbeddedType,
          onShowJsonViewerDialog: this.props.onShowJsonViewerDialog,
        };
        this.setState({ selectObjectDialog });
      }
    }
  }

  private deleteObjects(rowIndices: Set<number>) {
    if (!this.props.readOnly) {
      try {
        const { focus, realm, onClassFocussed } = this.props;

        this.write(() => {
          const objects = this.getHighlightedObjects(rowIndices);
          if (realm && focus.kind === 'class') {
            for (const object of objects) {
              realm.delete(object);
            }
          } else if (focus.kind === 'list') {
            // Creating a list of the indices of the objects in the original (unfiltered, unsorted) list
            const listIndices: number[] = [];
            for (const object of objects) {
              const index = focus.results.indexOf(object);
              listIndices.push(index);
            }
            // Sort and reverse, in-place
            listIndices.sort((a, b) => a - b).reverse();
            // Remove these objects from the list one by one - starting from the bottom
            for (const index of listIndices) {
              focus.results.splice(index, 1);
            }
          } else if (focus.kind === 'single-object') {
            if (focus.results[0]) {
              const object = focus.results.pop();
              realm.delete(object);
              if (onClassFocussed) {
                onClassFocussed(focus.parent.objectSchema().name, focus.parent);
              }
            }
          }
        });
      } catch (err) {
        showError('Error deleting the object', err);
      }
    }
  }

  private getHighlightedObjects(rowIndices: Set<number>) {
    const { results } = this.filteredSortedResults(
      this.props.focus.results,
      this.state.query,
      this.state.sorting,
    );
    const result = new Set<Realm.Object>();
    for (const index of rowIndices) {
      const object = results[index];
      result.add(object);
    }
    return result;
  }

  private generateDeleteTexts(focus: Focus, multiple: boolean) {
    if (focus.kind === 'list') {
      const parent = focus.isEmbedded
        ? focus.parent.objectSchema().name
        : 'list';
      const target = focus.isEmbedded
        ? 'embedded object'
        : multiple
        ? 'rows'
        : 'row';
      const determinedTarget = `${multiple ? 'these' : 'this'} ${target}`;

      return {
        label: `Remove selected ${target} from the ${parent}`,
        title: `Removing ${target}`,
        description: `Are you sure you want to remove ${determinedTarget} from the ${parent}?`,
      };
    } else {
      const target = multiple ? 'objects' : 'object';
      const determinedTarget = `${multiple ? 'these' : 'this'} ${target}`;

      return {
        label: `Delete selected ${target}`,
        title: `Delete ${target}`,
        description: `Are you sure you want to delete ${determinedTarget}?`,
      };
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

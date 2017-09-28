import * as React from 'react';
import * as Realm from 'realm';

import { ConfirmModal } from '../reusable/confirm-modal';
import { ContextMenu } from '../reusable/context-menu';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { ContentContainer } from './ContentContainer';
import './RealmBrowser.scss';
import { IList } from './RealmBrowserContainer';
import { SelectObject } from './SelectObject';
import { Sidebar } from './Sidebar';

export const RealmBrowser = ({
  closeSelectObject,
  columnToHighlight,
  confirmModal,
  contextMenu,
  getSchemaLength,
  getSelectedData,
  getSelectedSchema,
  list,
  onCellChange,
  onCellClick,
  onContextMenu,
  onContextMenuClose,
  onSchemaSelected,
  progress,
  rowToHighlight,
  schemas,
  selectedSchemaName,
  selectObject,
  updateObjectReference,
  onCellChangeOrder,
  setRowToHighlight,
}: {
  closeSelectObject: () => void;
  columnToHighlight?: number;
  confirmModal?: {
    yes: () => void;
    no: () => void;
  };
  contextMenu: any;
  getSchemaLength: (name: string) => number;
  getSelectedData: () => any;
  getSelectedSchema: () => Realm.ObjectSchema | null;
  list?: IList;
  onCellChange: (object: any, propertyName: string, value: string) => void;
  onCellClick: (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onContextMenu: (
    e: React.SyntheticEvent<any>,
    object: any,
    property: Realm.ObjectSchemaProperty,
  ) => void;
  onContextMenuClose: () => void;
  onSchemaSelected: (name: string, objectToScroll: any) => void;
  progress: ILoadingProgress;
  rowToHighlight?: number;
  schemas: Realm.ObjectSchema[];
  selectedSchemaName?: string;
  selectObject?: any;
  updateObjectReference: (object: any) => void;
  onCellChangeOrder: (currentIndex: number, newIndex: number) => void;
  setRowToHighlight: (row: number, column?: number) => void;
}) => {
  const values = getSelectedData();
  return (
    <div className="RealmBrowser">
      <Sidebar
        getSchemaLength={getSchemaLength}
        list={list}
        onSchemaSelected={onSchemaSelected}
        progress={progress}
        schemas={schemas}
        selectedSchemaName={selectedSchemaName}
      />
      <div className="RealmBrowser__Wrapper">
        <ContentContainer
          columnToHighlight={columnToHighlight}
          data={values}
          onCellChange={onCellChange}
          onCellChangeOrder={
            selectedSchemaName === 'list' ? onCellChangeOrder : undefined
          }
          onCellClick={onCellClick}
          onContextMenu={onContextMenu}
          progress={progress}
          rowToHighlight={rowToHighlight}
          schema={getSelectedSchema()}
          setRowToHighlight={setRowToHighlight}
        />
      </div>
      {contextMenu && (
        <ContextMenu {...contextMenu} close={onContextMenuClose} />
      )}
      {confirmModal && (
        <ConfirmModal
          title="Deleting object ..."
          description="Are you sure you want to delete this object?"
          status={true}
          yes={confirmModal.yes}
          no={confirmModal.no}
        />
      )}
      {selectObject && (
        <SelectObject
          status={true}
          schema={selectObject.schema}
          data={selectObject.data}
          optional={selectObject.optional}
          schemaName={selectObject.schemaName}
          updateReference={updateObjectReference}
          close={closeSelectObject}
        />
      )}

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};

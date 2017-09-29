import * as React from 'react';
import * as Realm from 'realm';

import { ConfirmModal } from '../reusable/confirm-modal';
import { ContextMenu } from '../reusable/context-menu';
import { ContentContainer } from './ContentContainer';
import './RealmBrowser.scss';
import { IList } from './RealmBrowserContainer';
import { SelectObject } from './SelectObject';
import { Sidebar } from './Sidebar';

export const RealmBrowser = ({
  getSchemaLength,
  getSelectedSchema,
  onCellChange,
  onSchemaSelected,
  onCellClick,
  schemas,
  rowToHighlight,
  columnToHighlight,
  getSelectedData,
  selectedSchemaName,
  list,
  onContextMenu,
  contextMenu,
  onContextMenuClose,
  confirmModal,
  selectObject,
  closeSelectObject,
  updateObjectReference,
}: {
  getSchemaLength: (name: string) => number;
  getSelectedData: () => any;
  getSelectedSchema: () => Realm.ObjectSchema | null;
  onCellChange: (object: any, propertyName: string, value: string) => void;
  onSchemaSelected: (name: string, objectToScroll: any) => void;
  onCellClick: (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  schemas: Realm.ObjectSchema[];
  rowToHighlight: number | null;
  columnToHighlight?: number;
  selectedSchemaName?: string | null;
  list: IList | null;
  onContextMenu: (
    e: React.SyntheticEvent<any>,
    object: any,
    property: Realm.ObjectSchemaProperty,
  ) => void;
  contextMenu: any;
  onContextMenuClose: () => void;
  confirmModal?: {
    yes: () => void;
    no: () => void;
  } | null;
  selectObject?: any;
  closeSelectObject: () => void;
  updateObjectReference: (object: any) => void;
}) => {
  const values = getSelectedData();
  return (
    <div className="RealmBrowser">
      <Sidebar
        schemas={schemas}
        onSchemaSelected={onSchemaSelected}
        selectedSchemaName={selectedSchemaName}
        getSchemaLength={getSchemaLength}
        list={list}
      />
      <div className="RealmBrowser__Wrapper">
        <ContentContainer
          schema={getSelectedSchema()}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          columnToHighlight={columnToHighlight}
          rowToHighlight={rowToHighlight}
          data={values}
          onContextMenu={onContextMenu}
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
    </div>
  );
};

import * as React from 'react';
import * as Realm from 'realm';

import { ConfirmModal } from '../reusable/confirm-modal';
import { ContextMenu } from '../reusable/context-menu';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { ContentContainer } from './ContentContainer';
import { IFocus } from './focus';
import { SelectObject } from './SelectObject';
import { Sidebar } from './Sidebar';
import { CellChangeHandler, CellClickHandler, IHighlight } from './table';

import './RealmBrowser.scss';

export const RealmBrowser = ({
  closeSelectObject,
  columnToHighlight,
  confirmModal,
  contextMenu,
  focus,
  getSchemaLength,
  highlight,
  onCellChange,
  onCellClick,
  onContextMenu,
  onContextMenuClose,
  onSchemaSelected,
  progress,
  rowToHighlight,
  schemas,
  selectObject,
  updateObjectReference,
}: {
  closeSelectObject: () => void;
  columnToHighlight?: number;
  confirmModal?: {
    yes: () => void;
    no: () => void;
  };
  contextMenu: any;
  focus: IFocus | null;
  getSchemaLength: (name: string) => number;
  highlight?: IHighlight;
  onCellChange: CellChangeHandler;
  onCellClick: CellClickHandler;
  onContextMenu: (
    e: React.SyntheticEvent<any>,
    object: any,
    rowIndex: number,
    property: Realm.ObjectSchemaProperty,
  ) => void;
  onContextMenuClose: () => void;
  onSchemaSelected: (name: string, objectToScroll: any) => void;
  progress: ILoadingProgress;
  rowToHighlight?: number;
  schemas: Realm.ObjectSchema[];
  selectObject?: any;
  updateObjectReference: (object: any) => void;
}) => {
  return (
    <div className="RealmBrowser">
      <Sidebar
        focus={focus}
        getSchemaLength={getSchemaLength}
        onSchemaSelected={onSchemaSelected}
        progress={progress}
        schemas={schemas}
      />
      <div className="RealmBrowser__Wrapper">
        <ContentContainer
          focus={focus}
          highlight={highlight}
          onCellChange={onCellChange}
          onCellClick={onCellClick}
          onContextMenu={onContextMenu}
          progress={progress}
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
      {/* TODO: Reimplement this */}
      {/*selectObject && (
        <SelectObject
          status={true}
          schema={selectObject.schema}
          data={selectObject.data}
          optional={selectObject.optional}
          schemaName={selectObject.schemaName}
          updateReference={updateObjectReference}
          close={closeSelectObject}
        />
      )*/}

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};

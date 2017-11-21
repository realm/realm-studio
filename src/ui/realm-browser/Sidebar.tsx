import * as classnames from 'classnames';
import * as React from 'react';
import {
  Badge,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from 'reactstrap';

import { AutoSaveChangeHandler } from '.';
import { ILoadingProgress } from '../reusable/loading-overlay';
import { IClassFocus, IFocus, IListFocus } from './focus';
import * as objectCell from './table/types/ObjectCell';

import './RealmBrowser.scss';

import * as util from 'util';

const isSelected = (focus: IFocus | null, schemaName: string) => {
  if (focus && focus.kind === 'class') {
    return (focus as IClassFocus).className === schemaName;
  } else if (focus && focus.kind === 'list') {
    return (focus as IListFocus).parent.objectSchema().name === schemaName;
  } else {
    return false;
  }
};

const ListFocusComponent = ({
  focus,
  onSchemaSelected,
}: {
  focus: IListFocus;
  onSchemaSelected: (name: string, objectToScroll?: any) => void;
}) => {
  return (
    <div className={classnames('RealmBrowser__Sidebar__List')}>
      <div className="RealmBrowser__Sidebar__List__Name">
        <span className="RealmBrowser__Sidebar__List__Name__Text">
          List of {focus.property.objectType}
        </span>
        <Badge color="primary">{focus.results.length}</Badge>
      </div>
      <div className="RealmBrowser__Sidebar__List__Parent">
        <div>
          <strong>{focus.property.name}</strong> on
        </div>
        <div>
          {!focus.parent.objectSchema().primaryKey ? 'a ' : null}
          <span
            onClick={() =>
              onSchemaSelected(focus.parent.objectSchema().name, focus.parent)}
            className="RealmBrowser__Sidebar__List__ParentObject"
            title={objectCell.display(focus.parent, true)}
          >
            {objectCell.display(focus.parent, false)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = ({
  dataVersion,
  dataVersionAtBeginning,
  focus,
  getSchemaLength,
  isAutoSaveEnabled,
  onAutoSaveChange,
  onDiscardChanges,
  onSaveChanges,
  onSchemaSelected,
  progress,
  schemas,
}: {
  dataVersion: number;
  dataVersionAtBeginning?: number;
  focus: IFocus | null;
  getSchemaLength: (name: string) => number;
  isAutoSaveEnabled: boolean;
  onAutoSaveChange: AutoSaveChangeHandler;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  onSchemaSelected: (name: string, objectToScroll?: any) => void;
  progress: ILoadingProgress;
  schemas: Realm.ObjectSchema[];
}) => {
  const versionDifference =
    typeof dataVersionAtBeginning === 'number'
      ? dataVersion - dataVersionAtBeginning
      : 0;
  const hasUnsavedChanges = versionDifference > 0;
  return (
    <div className="RealmBrowser__Sidebar">
      <div className="RealmBrowser__Sidebar__Header">Classes</div>
      {schemas && schemas.length > 0 ? (
        <ul className="RealmBrowser__Sidebar__SchemaList">
          {schemas.map(schema => {
            const selected = isSelected(focus, schema.name);
            const schemaClass = classnames(
              'RealmBrowser__Sidebar__Schema__Info',
              {
                'RealmBrowser__Sidebar__Schema__Info--selected': selected,
              },
            );
            return (
              <li
                key={schema.name}
                className="RealmBrowser__Sidebar__Schema"
                title={schema.name}
              >
                <div
                  className={schemaClass}
                  onClick={() => onSchemaSelected(schema.name)}
                >
                  <span className="RealmBrowser__Sidebar__Schema__Name">
                    {schema.name}
                  </span>
                  <Badge color="primary">{getSchemaLength(schema.name)}</Badge>
                </div>
                {selected && focus && focus.kind === 'list' ? (
                  <ListFocusComponent
                    focus={focus as IListFocus}
                    onSchemaSelected={onSchemaSelected}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : progress.done ? (
        <div className="RealmBrowser__Sidebar__SchemaList--empty" />
      ) : null}

      {hasUnsavedChanges ? (
        <section className="RealmBrowser__Sidebar__UnsavedChanges">
          You have {versionDifference} unsaved
          {versionDifference > 1 ? ' changes' : ' change'}
        </section>
      ) : null}

      {hasUnsavedChanges ? (
        <section className="RealmBrowser__Sidebar__Controls">
          <Button
            className="RealmBrowser__Sidebar__ControlButton"
            color="secondary"
            onClick={onDiscardChanges}
            size="sm"
          >
            Discard
          </Button>
          <Button
            className="RealmBrowser__Sidebar__ControlButton"
            size="sm"
            color="primary"
            onClick={onSaveChanges}
          >
            Save
          </Button>
        </section>
      ) : (
        <section className="RealmBrowser__Sidebar__Controls">
          <Button
            className="RealmBrowser__Sidebar__ControlButton"
            size="sm"
            color={isAutoSaveEnabled ? 'primary' : 'secondary'}
            onClick={e => {
              onAutoSaveChange(!isAutoSaveEnabled);
            }}
          >
            {isAutoSaveEnabled ? 'Saving automatically' : 'Save automatically'}
          </Button>
        </section>
      )}
    </div>
  );
};

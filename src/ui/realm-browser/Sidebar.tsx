import * as classnames from 'classnames';
import * as React from 'react';
import { Badge, Button } from 'reactstrap';

import { ILoadingProgress } from '../reusable/loading-overlay';
import { displayObject } from './display';
import { Focus, IClassFocus, IListFocus } from './focus';

import './RealmBrowser.scss';

import * as util from 'util';

export const isSelected = (focus: Focus | null, schemaName: string) => {
  if (focus && focus.kind === 'class') {
    return focus.className === schemaName;
  } else if (focus && focus.kind === 'list') {
    return focus.parent.objectSchema().name === schemaName;
  } else {
    return false;
  }
};

const ListFocusComponent = ({
  focus,
  onClassSelected,
}: {
  focus: IListFocus;
  onClassSelected: (name: string, objectToScroll?: any) => void;
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
              onClassSelected(focus.parent.objectSchema().name, focus.parent)}
            className="RealmBrowser__Sidebar__List__ParentObject"
            title={displayObject(focus.parent, true)}
          >
            {displayObject(focus.parent, false)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = ({
  focus,
  getSchemaLength,
  onClassSelected,
  progress,
  schemas,
  toggleAddSchema,
}: {
  focus: Focus | null;
  getSchemaLength: (name: string) => number;
  onClassSelected: (name: string, objectToScroll?: any) => void;
  progress: ILoadingProgress;
  schemas: Realm.ObjectSchema[];
  toggleAddSchema: () => void;
}) => (
  <div className="RealmBrowser__Sidebar">
    <div className="RealmBrowser__Sidebar__Header">
      <span>Classes</span>
      <Button size="sm" onClick={toggleAddSchema}>
        <i className="fa fa-plus" />
      </Button>
    </div>
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
                onClick={() => onClassSelected(schema.name)}
              >
                <span className="RealmBrowser__Sidebar__Schema__Name">
                  {schema.name}
                </span>
                <Badge color="primary">{getSchemaLength(schema.name)}</Badge>
              </div>
              {selected && focus && focus.kind === 'list' ? (
                <ListFocusComponent
                  focus={focus as IListFocus}
                  onClassSelected={onClassSelected}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    ) : progress.status === 'done' ? (
      <div className="RealmBrowser__Sidebar__SchemaList--empty" />
    ) : null}
  </div>
);

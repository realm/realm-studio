import * as classnames from 'classnames';
import * as React from 'react';
import { Badge } from 'reactstrap';
import { IList } from './RealmBrowserContainer';

import './RealmBrowser.scss';

import * as util from 'util';

export const Sidebar = ({
  onSchemaSelected,
  schemas,
  selectedSchemaName,
  getSchemaLength,
  list,
}: {
  onSchemaSelected: (name: string, objectToScroll?: any) => void;
  schemas: Realm.ObjectSchema[];
  selectedSchemaName?: string | null;
  getSchemaLength: (name: string) => number;
  list: IList | null;
}) => (
  <div className="RealmBrowser__Sidebar">
    <div className="RealmBrowser__Sidebar__Header">Classes</div>
    <ul className="RealmBrowser__Sidebar__SchemaList">
      {schemas.map(schema => {
        const schemaClass = classnames({
          RealmBrowser__Sidebar__Schema__Info: true,
          'RealmBrowser__Sidebar__Schema__Info--selected':
            selectedSchemaName === schema.name,
        });
        const listClass = classnames({
          RealmBrowser__Sidebar__Sublevel: true,
          'RealmBrowser__Sidebar__Sublevel--selected':
            selectedSchemaName === 'list',
        });
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
            {list &&
              list.parent.objectSchema().name === schema.name && (
                <div className={listClass}>
                  <div className="RealmBrowser__Sidebar__Sublevel__Name">
                    <i className="fa fa-caret-right" />
                    <span className="RealmBrowser__Sidebar__Sublevel__Name__Text">
                      {`List: ${list.schemaName}`}
                    </span>
                    <Badge color="primary">{list.data.length}</Badge>
                  </div>
                  <div className="RealmBrowser__Sidebar__Sublevel__Parent">
                    <div className="RealmBrowser__Sidebar__Sublevel__Label">
                      Parent
                    </div>
                    <div className="RealmBrowser__Sidebar__Sublevel__Properties">
                      Object:
                      <span
                        onClick={() =>
                          onSchemaSelected(
                            list.parent.objectSchema().name,
                            list.parent,
                          )}
                        className="RealmBrowser__Sidebar__Sublevel__Properties--ref"
                        title={util.inspect(list.parent)}
                      >
                        Information
                      </span>
                    </div>
                    <div className="RealmBrowser__Sidebar__Sublevel__Properties">
                      Property: {list.property.name}
                    </div>
                  </div>
                </div>
              )}
          </li>
        );
      })}
    </ul>
  </div>
);

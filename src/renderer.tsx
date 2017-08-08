import * as electron from 'electron'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

// FIXME: see https://github.com/realm/realm-js/issues/818
var userDataPath = electron.remote.app.getPath("userData");
process.chdir(userDataPath);
import * as Realm from 'realm'


ReactDOM.render(
  <div>
    Hi there
  </div>,
  document.getElementById("app")
);

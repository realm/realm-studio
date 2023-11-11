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

import { MainActions } from '../../main/MainActions';
import { ImportFormat } from '../../services/data-importer';
import { IRealmBrowserWindowProps } from '../../windows/WindowProps';
import { ActionSender } from '../ActionSender';
import { LoopbackTransport, RendererTransport } from '../transports';

export class Sender extends ActionSender {
  constructor() {
    // Use the renderer transport if the sender is accessed from the renderer and the loopback otherwise.
    super(
      process.type === 'renderer'
        ? new RendererTransport()
        : LoopbackTransport.getInstance(),
    );
  }

  public checkForUpdates() {
    return this.send(MainActions.CheckForUpdates);
  }

  public showGreeting() {
    return this.send(MainActions.ShowGreeting);
  }

  public showOpenLocalRealm() {
    return this.send(MainActions.ShowOpenLocalRealm);
  }

  public showImportData(format: ImportFormat) {
    return this.send(MainActions.ShowImportData, format);
  }

  public showRealmBrowser(props: IRealmBrowserWindowProps) {
    return this.send(MainActions.ShowRealmBrowser, props);
  }

  public showConnectToServer(url?: string) {
    return this.send(MainActions.ShowConnectToServer, url);
  }

  public clearRendererCache() {
    return this.send(MainActions.ClearRendererCache);
  }
}

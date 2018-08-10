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

export enum MainActions {
  AuthenticateWithEmail = 'authenticate-with-email',
  AuthenticateWithGitHub = 'authenticate-with-github',
  CheckForUpdates = 'check-for-updates',
  Deauthenticate = 'deauthenticate',
  RefreshCloudStatus = 'refresh-cloud-status',
  ReopenGitHubUrl = 'reopen-github-url',
  SetRaasEndpoint = 'set-raas-endpoint',
  ShowCloudAuthentication = 'show-cloud-authentication',
  ShowConnectToServer = 'show-connect-to-server',
  ShowGreeting = 'show-server-administration',
  ShowImportData = 'show-import-data',
  ShowOpenLocalRealm = 'show-open-local-realm',
  ShowRealmBrowser = 'show-realm-browser',
  ShowServerAdministration = 'show-server-administration',
}

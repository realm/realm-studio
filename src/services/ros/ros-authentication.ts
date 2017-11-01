interface ICredentials {
  kind: string;
  url: string;
}

export interface IUsernamePasswordCredentials extends ICredentials {
  kind: 'password';
  username: string;
  password: string;
}

export interface IAdminTokenCredentials extends ICredentials {
  kind: 'token';
  token: string;
}

export interface IOtherCredentials extends ICredentials {
  kind: 'other';
  options: object;
}

export type IServerCredentials =
  | IUsernamePasswordCredentials
  | IAdminTokenCredentials
  | IOtherCredentials;

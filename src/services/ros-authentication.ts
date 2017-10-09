export interface IUsernamePasswordCredentials {
  url: string;
  username: string;
  password: string;
}

export interface IAdminTokenCredentials {
  url: string;
  token: string;
}

export type IServerCredentials =
  | IUsernamePasswordCredentials
  | IAdminTokenCredentials;

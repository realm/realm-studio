import * as fs from 'fs-extra';
import * as Realm from 'realm';
import {
  AuthService,
  HealthService,
  LogService,
  PermissionService,
  RealmDirectoryService,
  Server,
  SyncProxyService,
  SyncService,
} from 'realm-object-server';
import { URL } from 'url';

// FIXME: This test realm object server is not completely implemented just yet.
// It needs to register the appropreate services.

export class TestRealmObjectServer extends Server {
  constructor() {
    super({
      port: 0, // Pick a port for us
      dataPath: fs.mkdtempSync('/tmp/realm-studio-ros-'),
      logLevel: 'warn',
    });
    // TODO: Add a lot of services!
    const authService = new AuthService({
      accessTokenTtl: 10 * 60,
      refreshTokenTtl: 10 * 60 * 60 * 24 * 365 * 10,
    });
    this.addService(authService);
    // this.addService(new RealmDirectoryService());
    // this.addService(new LogService());
    // this.addService(new SyncProxyService());
    // this.addService(new SyncService());
    // this.addService(new HealthService());
    // this.addService(new PermissionService());
  }

  public getUrl(): URL {
    const { address, family, port } = this.httpServer.address();
    if (family === 'IPv6') {
      return new URL(`http://[${address}]:${port}`);
    } else {
      return new URL(`http://${address}:${port}`);
    }
  }

  public getAdminUser(): Promise<Realm.Sync.User> {
    const url = this.getUrl().toString();
    return Realm.Sync.User.login(url, 'realm-admin', '');
  }
}

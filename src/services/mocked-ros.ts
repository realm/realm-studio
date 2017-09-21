import * as faker from "faker";
import * as Realm from "realm";

import {
  IPermission,
  IRealmFile,
  IUser,
  IUserMetadataRow,
  permissionSchema,
  realmFileSchema,
  userMetadataRowSchema,
  userSchema,
  accountSchema
} from "./ros";

export const getAdminRealm = async (): Promise<Realm> => {
  return new Realm({
    path: "./data/__admin.realm",
    schema: [
      userSchema,
      userMetadataRowSchema,
      realmFileSchema,
      permissionSchema,
      accountSchema
    ],
  });
};

export const createFakeRealmFile = (adminRealm: Realm) => {
  const creator = getRandomUser(adminRealm);
  const pathPartCount = faker.random.number({ min: 1, max: 5 });
  let path = "/" + faker.random.uuid();
  for (let p = 0; p < pathPartCount; p++) {
    path += "/" + faker.random.arrayElement([
      faker.hacker.noun(),
      faker.hacker.verb(),
    ]).toLowerCase();
  }

  const permissionsCount = faker.random.number({ min: 0, max: 3 });
  const permissions: IPermission[] = [];
  for (let p = 0; p < permissionsCount; p++) {
    const permission: IPermission = {
      user: creator,
      mayRead: true,
      mayWrite: true,
      mayManage: true
    };

    permissions.push(permission);
  }

  const realmFile: IRealmFile = {
    path,
    creatorId: creator.userId,
    creationDate: faker.date.past(2),
    permissions,
  };
  adminRealm.create("RealmFile", realmFile);
};

export const createFakeUser = (adminRealm: Realm) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  const user: IUser = {
    userId: email,
    isAdmin: false,
    metadata: [
      { key: "firstName", value: firstName },
      { key: "lastName", value: lastName },
    ],
    accounts: [],
  };
  adminRealm.create("User", user);
};

export const createFakeUsersAndRealms = ({
  adminRealm,
  userCount,
  realmCount,
}: {
  adminRealm: Realm,
  userCount: number,
  realmCount: number,
}) => {
  let createdUsers = 0;
  let createdRealms = 0;
  adminRealm.write(() => {
    for (let u = 0; u < userCount; u++) {
      try {
        createFakeUser(adminRealm);
        createdUsers++;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Failed to create a fake user:`, err);
      }
    }
  });
  adminRealm.write(() => {
    for (let r = 0; r < realmCount; r++) {
      try {
        createFakeRealmFile(adminRealm);
        createdRealms++;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Failed to create a fake realm:`, err);
      }
    }
  });
  return {
    createdRealms,
    createdUsers,
  };
};

export const getRandomUser = (adminRealm: Realm) => {
  const users = adminRealm.objects<IUser>("User");
  if (users.length === 0) {
    throw new Error("Cannot get a random user when no users exists");
  }
  return users[faker.random.number({ min: 0, max: users.length - 1 })];
};

export const updateUserPassword = (userId: string, password: string) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Would have changed the password of ${userId} to ${password}`);
};

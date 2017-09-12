import * as faker from "faker";
import * as Realm from "realm";

import {
  IPermissionCondition,
  IRealmFile,
  IUser,
  IUserMetadataRow,
  permissionConditionSchema,
  PermissionConditionType,
  realmFileSchema,
  userMetadataRowSchema,
  userSchema,
} from "./ros";

export const getAuthRealm = async (): Promise<Realm> => {
  return new Realm({
    path: "./data/auth.realm",
    schema: [
      userSchema,
      userMetadataRowSchema,
    ],
  });
};

export const getRealmManagementRealm = async (): Promise<Realm> => {
  return new Realm({
    path: "./data/realmmanagement.realm",
    schema: [
      realmFileSchema,
      permissionConditionSchema,
    ],
  });
};

export const createFakeRealmFile = (realmManagementRealm: Realm, authRealm: Realm) => {
  const creator = getRandomUser(authRealm);
  const pathPartCount = faker.random.number({ min: 1, max: 5 });
  let path = "/" + faker.random.uuid();
  for (let p = 0; p < pathPartCount; p++) {
    path += "/" + faker.random.arrayElement([
      faker.hacker.noun(),
      faker.hacker.verb(),
    ]).toLowerCase();
  }

  const permissionsCount = faker.random.number({ min: 0, max: 3 });
  const permissions: IPermissionCondition[] = [];
  for (let p = 0; p < permissionsCount; p++) {
    const permission: IPermissionCondition = {
      path,
      accessLevel: faker.random.number({ min: 0, max: 3 }),
      type: faker.random.number({ min: 0, max: 3 }),
    };
    if (permission.type === PermissionConditionType.user) {
      // TODO: Add the users id?
    }
    permissions.push(permission);
  }

  const realmFile: IRealmFile = {
    path,
    creatorId: creator.userId,
    creationDate: faker.date.past(2),
    permissions,
  };
  realmManagementRealm.create("RealmFile", realmFile);
};

export const createFakeUser = (authRealm: Realm) => {
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
  };
  authRealm.create("User", user);
};

export const createFakeUsersAndRealms = ({
  authRealm,
  realmManagementRealm,
  userCount,
  realmCount,
}: {
  authRealm: Realm,
  realmManagementRealm: Realm,
  userCount: number,
  realmCount: number,
}) => {
  let createdUsers = 0;
  let createdRealms = 0;
  authRealm.write(() => {
    for (let u = 0; u < userCount; u++) {
      try {
        createFakeUser(authRealm);
        createdUsers++;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Failed to create a fake user:`, err);
      }
    }
  });
  realmManagementRealm.write(() => {
    for (let r = 0; r < realmCount; r++) {
      try {
        createFakeRealmFile(realmManagementRealm, authRealm);
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

export const getRandomUser = (authRealm: Realm) => {
  const users = authRealm.objects<IUser>("User");
  if (users.length === 0) {
    throw new Error("Cannot get a random user when no users exists");
  }
  return users[faker.random.number({ min: 0, max: users.length - 1 })];
};

export const updateUserPassword = (userId: string, password: string) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Would have changed the password of ${userId} to ${password}`);
};

import * as faker from "faker";
import * as Realm from "realm";

import { IPermissionCondition, IRealmFile, IUser, IUserMetadata, PermissionConditionType } from "./ros";

// These schemas are copied from ROS

const userSchema: Realm.ObjectSchema = {
  name: "User",
  primaryKey: "userId",
  properties: {
    userId: "string",
    isAdmin: { type: "bool", optional: false },
    metadata: { type: "list", objectType: "UserMetadata" },
  },
};

const metadataSchema: Realm.ObjectSchema = {
  name: "UserMetadata",
  properties: {
    userId: "string",
    key: "string",
    value: { type: "string", optional: true },
  },
};

const realmFileSchema: Realm.ObjectSchema = {
  name: "RealmFile",
  primaryKey: "path",
  properties: {
    path: "string",
    creatorId: "string",
    creationDate: "date",
    permissions: {
      type: "list",
      objectType: "PermissionCondition",
    },
  },
};

const permissionConditionSchema: Realm.ObjectSchema = {
  name: "PermissionCondition",
  properties: {
    path: "string",
    accessLevel: "int", // ['none', 'read', 'write', 'admin']
    type: "int", // ['all', 'user', 'metadata_exact', 'metadata_regex']
    key: { type: "string", optional: true },
    value: { type: "string", optional: true },
  },
};

const authRealm: Realm = new Realm({
  path: "./data/auth.realm",
  schema: [
    userSchema,
    metadataSchema,
  ],
});

const realmManagementRealm: Realm = new Realm({
  path: "./data/realmmanagement.realm",
  schema: [
    realmFileSchema,
    permissionConditionSchema,
  ],
});

// Functions for getting these realms

export const getAuthRealm = (): Realm => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of getAuthRealm`);
  return authRealm;
};

export const getRealmManagementRealm = () => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of getRealmManagementRealm`);
  return realmManagementRealm;
};

// Other functions

export const createFakeRealmFile = () => {
  const creator = getRandomUser();
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

export const createFakeUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  const user: IUser = {
    userId: email,
    isAdmin: false,
    metadata: [
      { userId: email, key: "firstName", value: firstName },
      { userId: email, key: "lastName", value: lastName },
    ],
  };
  authRealm.create("User", user);
};

export const createFakeUsersAndRealms = (userCount: number = 1000, realmCount: number = 1000) => {
  let createdUsers = 0;
  let createdRealms = 0;
  authRealm.write(() => {
    for (let u = 0; u < userCount; u++) {
      try {
        createFakeUser();
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
        createFakeRealmFile();
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

export const getRandomUser = () => {
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

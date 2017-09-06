import * as faker from "faker";
import * as Realm from "realm";

import { IAuthUser, IAuthUserMetadata, IPermissionCondition, IRealmFile, PermissionConditionType } from "./ros";

// These schemas are copied from ROS

const userSchema: Realm.ObjectSchema = {
  name: "AuthUser",
  primaryKey: "userId",
  properties: {
    userId: "string",
    isAdmin: { type: "bool", optional: false },
  },
};

const metadataSchema: Realm.ObjectSchema = {
  name: "AuthUserMetadata",
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
  // If no users exists - let"s create some fake ones
  const userCount = authRealm.objects("AuthUser").length;
  if (userCount < 1000) {
    const fakeUserCount = 1000 - userCount;
    authRealm.write(() => {
      for (let u = 0; u < fakeUserCount; u++) {
        try {
          createFakeUser();
        } catch (err) {
          /* tslint:disable-next-line:no-console */
          console.error(`Couldn't create a fake user.`);
        }
      }
    });
  }
  return authRealm;
};

export const getRealmManagementRealm = () => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of getRealmManagementRealm`);
  const realmCount = realmManagementRealm.objects("RealmFile").length;
  if (realmCount < 1000) {
    const fakeRealmCount = 1000 - realmCount;
    realmManagementRealm.write(() => {
      for (let r = 0; r < fakeRealmCount; r++) {
        try {
          createFakeRealmFile();
        } catch (err) {
          /* tslint:disable-next-line:no-console */
          console.error(`Couldn't create a fake realm file.`);
        }
      }
    });
  }
  return realmManagementRealm;
};

// Other functions

export const appendUserMetadata = (userId: string, key: string, value: string) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of appendUserMetadata`, userId, key, value);
  const metadatas = authRealm.objects<IAuthUserMetadata>("AuthUserMetadata").filtered("userId = $0", userId);
  authRealm.write(() => {
    authRealm.create<IAuthUserMetadata>("AuthUserMetadata", {
      key,
      userId,
      value,
    });
  });
};

export const createFakeRealmFile = () => {
  const creator = getRandomUser();
  const pathPartCount = faker.random.number({ min: 1, max: 5 });
  let path = "";
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
  const user: IAuthUser = {
    userId: email,
    isAdmin: faker.random.boolean(),
  };
  const metadatas: IAuthUserMetadata[] = [
    { userId: email, key: "firstName", value: firstName },
    { userId: email, key: "lastName", value: lastName },
  ];
  authRealm.create("AuthUser", user);
  metadatas.forEach(((metadata) => {
    authRealm.create("AuthUserMetadata", metadata);
  }));
};

export const getRandomUser = () => {
  const users = authRealm.objects<IAuthUser>("AuthUser");
  return users[faker.random.number({ min: 0, max: users.length })];
};

export const deleteUser = (userId: string) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of deleteUser`);

  authRealm.write(() => {
    const user = authRealm.objectForPrimaryKey<IAuthUser>("AuthUser", userId);
    authRealm.delete(user);
  });
};

export const deleteUserMetadata = (userId: string, index: number) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of deleteUserMetadata`, userId, index);
  const metadatas = authRealm.objects<IAuthUserMetadata>("AuthUserMetadata").filtered("userId = $0", userId);
  if (index >= 0 && index < metadatas.length) {
    authRealm.write(() => {
      authRealm.delete(metadatas[index]);
    });
  } else {
    throw new Error(`Cannot update users metadata, index ${index} is out of bounds.`);
  }
};

export const updateUser = (userId: string, values: Partial<IAuthUser>) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of updateUser`);

  const user = authRealm.objectForPrimaryKey<IAuthUser>("AuthUser", userId);
  authRealm.write(() => {
    if (user && typeof(values.isAdmin) !== "undefined") {
      user.isAdmin = values.isAdmin;
    }
  });
};

export const updateUserMetadata = (userId: string, index: number, key: string, value: string) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of updateUserMetadata`, userId, index, key, value);
  const metadatas = authRealm.objects<IAuthUserMetadata>("AuthUserMetadata").filtered("userId = $0", userId);
  if (index >= 0 && index < metadatas.length) {
    authRealm.write(() => {
      metadatas[index].key = key;
      metadatas[index].value = value;
    });
  } else {
    throw new Error(`Cannot update users metadata, index ${index} is out of bounds.`);
  }
};

export const updateUserPassword = (userId: string, password: string) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Would have changed the password of ${userId} to ${password}`);
};

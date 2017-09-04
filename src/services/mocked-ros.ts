import * as faker from "faker";
import * as Realm from "realm";

import { IAuthUser, IAuthUserMetadata } from "./ros";

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

export const getAuthRealm = (): Realm => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of getAuthRealm`);
  // If no users exists - let"s create some fake ones
  const userCount = authRealm.objects("AuthUser").length;
  if (userCount < 1000) {
    const fakeUserCount = 1000 - userCount;
    authRealm.write(() => {
      for (let u = 0; u < fakeUserCount; u++) {
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
      }
    });
  }
  return authRealm;
};

export const getRealmManagementRealm = () => {
  return realmManagementRealm;
};

export const deleteUser = (userId: string) => {
  /* tslint:disable-next-line:no-console */
  console.warn(`Using a mocked version of deleteUser`);

  authRealm.write(() => {
    const user = authRealm.objectForPrimaryKey<IAuthUser>("AuthUser", userId);
    authRealm.delete(user);
  });
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

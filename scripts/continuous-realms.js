/*
 * This script continuously creates Realms
 */

const Realm = require('realm');

const HOSTNAME = '127.0.0.1:9080';
const HTTP_URL = `http://${HOSTNAME}`;
const REALM_URL = `realm://${HOSTNAME}`;

const NOUNCE = Math.round(Math.random() * 10000);

const createUser = async () => {
  const username = `user-continuous-realms-${NOUNCE}`;
  return Realm.Sync.User.register(HTTP_URL, username, 'very-s3cure-y3s');
};

const run = async () => {
  console.log('Creating a user');
  const user = await createUser();
  console.log(`Created user: ${user.identity}`);
  let n = 0;
  setInterval(async () => {
    try {
      const path = `/~/continuous-realm-${n}`;
      console.log(`Creating a Realm: ${path}`);
      const realm = await Realm.open({
        schema: [],
        sync: {
          user,
          url: `${REALM_URL}${path}`,
        },
      });
      console.log(`Created the Realm`);
      realm.close();
      n++;
    } catch (err) {
      console.error(`Failed when creating a Realm: ${err.message}`);
    }
  }, 1000);
};

run().then(null, (err) => {
  console.log(`Failed: ${err.message}`);
  process.exit(1);
});

// Copy local realm to ROS

const Realm = require('realm');


// UPDATE THESE
const realm_server = 'localhost:9080';
const username     = 'tester@realm.io'; // this is the user doing the copy
const password     = 'a';

const source_realm_path = './SFRestaurants.realm'; // path on disk
const target_realm_path = '/~/restaurants'; // path on server


var copyObject = function(obj, objSchema, targetRealm) {
    const copy = {};
    for (var key in objSchema.properties) {
        const prop = objSchema.properties[key];
        if (!prop.hasOwnProperty('objectType')) {
            copy[key] = obj[key];
        }
        else if (prop['type'] == "list") {
            copy[key] = [];
        }
        else {
            copy[key] = null;
        }
    }

    // Add this object to the target realm
    targetRealm.create(objSchema.name, copy);
}

var getMatchingObjectInOtherRealm = function(sourceObj, source_realm, target_realm, class_name) {
    const allObjects = source_realm.objects(class_name);
    const ndx = allObjects.indexOf(sourceObj);

    // Get object on same position in target realm
    return target_realm.objects(class_name)[ndx];
}

var addLinksToObject = function(sourceObj, targetObj, objSchema, source_realm, target_realm) {
    for (var key in objSchema.properties) {
        const prop = objSchema.properties[key];
        if (prop.hasOwnProperty('objectType')) {
            if (prop['type'] == "list") {
                var targetList = targetObj[key];
                sourceObj[key].forEach((linkedObj) => {
                    const obj = getMatchingObjectInOtherRealm(linkedObj, source_realm, target_realm, prop.objectType);
                    targetList.push(obj);
                });
            }
            else {
                // Find the position of the linked object
                const linkedObj = sourceObj[key];
                if (linkedObj === null) {
                    continue;
                }

                // Set link to object on same position in target realm
                targetObj[key] = getMatchingObjectInOtherRealm(linkedObj, source_realm, target_realm, prop.objectType);
            }
        }
    }
}

var copyRealm = function(user, local_realm_path, remote_realm_url) {
    // Open the local realm
    const source_realm =  new Realm({path: local_realm_path});
    const source_realm_schema = source_realm.schema;

    // Create the new realm (with same schema as the source)
    const target_realm = new Realm({
        sync: {
            user: user,
            url:  remote_realm_url,
        },
        schema: source_realm_schema
    });

    target_realm.write(() => {
        // Copy all objects but ignore links for now
        source_realm_schema.forEach((objSchema) => {
            console.log("copying objects:", objSchema['name']);
            const allObjects = source_realm.objects(objSchema['name']);

            allObjects.forEach((obj) => {
                copyObject(obj, objSchema, target_realm)
            });
        });

        // Do a second pass to add links
        source_realm_schema.forEach((objSchema) => {
            console.log("updating links in:", objSchema['name']);
            const allSourceObjects = source_realm.objects(objSchema['name']);
            const allTargetObjects = target_realm.objects(objSchema['name']);

            for (var i = 0; i < allSourceObjects.length; ++i) {
                const sourceObject = allSourceObjects[i];
                const targetObject = allTargetObjects[i];

                addLinksToObject(sourceObject, targetObject, objSchema, source_realm, target_realm);
            }
        });
    });
}


// Login to server
Realm.Sync.User.login("http://" + realm_server, username, password, (error, user) => {
    if (error) {
        console.log("Login failed", error);
        return;
    }

    const remote_realm_url = "realm://" + realm_server + target_realm_path;

    copyRealm(user, source_realm_path, remote_realm_url);

    console.log("done");
});

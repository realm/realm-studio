/* import * as exporter from './schema-exporter/schema-exporter';
import * as models2 from './tests/models/all/AllTypes'
import * as models1 from './tests/models/sample/SampleTypes'

const Realm = require('realm');

function makeRealm(path, schema) {
    let realm = new Realm({
        path: path, 
        schema: schema,
        deleteRealmIfMigrationNeeded: true
    })
    console.log(`Generated ${path}`)
}

makeRealm('realms/sample/SampleTypes.realm', [models1.SampleTypes])

makeRealm('realms/all/AllTypes.realm', 
    [models2.RequiredTypes,
    models2.OptionalTypes,
    models2.IndexedTypes,
    models2.ReverseType]
)

setTimeout(() => process.exit(0), 1000); */

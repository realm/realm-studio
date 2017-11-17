/* import * as exporter from './schema-exporter/';

const Realm = require('realm');

function testRealm(path) {
    let realm = new Realm( {path: path} )
    
    let exp = new exporter.SwiftSchemaExporter()
    // let exp = new exporter.JSSchemaExporter()
    
    exp.exportSchema(realm)
    exp.writeFilesToDisk('./output/')
    realm.close()
}

let file1 = 'realms/sample/SampleTypes.realm'
let file2 = 'realms/all/AllTypes.realm'


// testRealm(file1)
testRealm(file2)

setTimeout(() => process.exit(0), 3000);
*/
/*





    TODO
        - Add tests 
        - Add comment to generated files that linkingObjects and 
          default values are not represented in the models


        Swift
            types of an array: can they not be optional? (see https://realm.io/docs/swift/latest/#property-cheatsheet)
*/

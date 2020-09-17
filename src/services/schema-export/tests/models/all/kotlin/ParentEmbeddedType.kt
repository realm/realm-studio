// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here

import io.realm.RealmObject
import io.realm.RealmList

open class ParentEmbeddedType : RealmObject() {

    var embeddedObject: ChildEmbeddedType? = null
    var embeddedObjectList: RealmList<ChildEmbeddedType> = RealmList()

}

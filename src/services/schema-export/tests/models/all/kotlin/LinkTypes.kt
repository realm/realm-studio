// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here

import io.realm.RealmObject
import io.realm.RealmList
import io.realm.annotations.Required

open class LinkTypes : RealmObject() {

    var objectType: ReverseType? = null
    var objectType2: ReverseType? = null
    @Required
    var listType: RealmList<ReverseType> = RealmList()

}

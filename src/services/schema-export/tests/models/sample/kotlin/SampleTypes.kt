// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here

import io.realm.RealmObject
import io.realm.RealmList
import java.util.Date
import io.realm.annotations.Index
import io.realm.annotations.PrimaryKey

open class SampleTypes : RealmObject() {

    @PrimaryKey
    var primary: Long = 0
    var ArrayFloatValue: Float? = null
    var listOfStrings: RealmList<String> = RealmList()
    var listOfOptionalDates: RealmList<Date>? = null
    @Index
    var indexedInt: Long = 0
    var linkToObject: SampleTypes? = null
    var listOfObjects: RealmList<SampleTypes> = RealmList()

}

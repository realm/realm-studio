// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here

import io.realm.RealmObject
import java.util.Date
import io.realm.RealmList

open class RequiredTypes : RealmObject() {

    var boolRequired: Boolean = false
    var intRequired: Long = 0
    var floatRequired: Float = 0.0f
    var doubleRequired: Double = 0.0
    var stringRequired: String = ""
    var dateRequired: Date = Date()
    var dataRequired: ByteArray = ByteArray(0)
    var boolRequiredArray: RealmList<Boolean> = RealmList()
    var intRequiredArray: RealmList<Long> = RealmList()
    var floatRequiredArray: RealmList<Float> = RealmList()
    var doubleRequiredArray: RealmList<Double> = RealmList()
    var stringRequiredArray: RealmList<String> = RealmList()
    var dateRequiredArray: RealmList<Date> = RealmList()
    var dataRequiredArray: RealmList<ByteArray> = RealmList()
    var objectRequiredArray: RealmList<RequiredTypes> = RealmList()

}

// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here

import io.realm.RealmList
import io.realm.RealmObject
import java.util.Date

open class RequiredTypes : RealmObject() {
    var isBoolRequired: Boolean = false
    var intRequired: Long = 0
    var floatRequired: Float = 0.0f
    var doubleRequired: Double = 0.0
    var stringRequired: String = ""
    var dateRequired: Date = Date()
    var dataRequired: ByteArray = ByteArray(0)
    var boolRequiredArray: RealmList<Boolean> = RealmList<Boolean>()
    var intRequiredArray: RealmList<Long> = RealmList<Long>()
    var floatRequiredArray: RealmList<Float> = RealmList<Float>()
    var doubleRequiredArray: RealmList<Double> = RealmList<Double>()
    var stringRequiredArray: RealmList<String> = RealmList<String>()
    var dateRequiredArray: RealmList<Date> = RealmList<Date>()
    var dataRequiredArray: RealmList<ByteArray> = RealmList<ByteArray>()
    var objectRequiredArray: RealmList<RequiredTypes> = RealmList<RequiredTypes>()

}

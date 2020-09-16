// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here

import io.realm.RealmObject
import java.util.Date
import io.realm.RealmList
import io.realm.annotations.Required

open class RequiredTypes : RealmObject() {

    var boolRequired: Boolean = false
    var intRequired: Long = 0
    var floatRequired: Float = 0.0f
    var doubleRequired: Double = 0.0
    var stringRequired: String = ""
    var dateRequired: Date = Date()
    var dataRequired: ByteArray = ByteArray(0)
    var objectIdRequired: ObjectId = ObjectId()
    var decimal128Required: Decimal128 = Decimal128()
    @Required
    var boolRequiredArray: RealmList<Boolean> = RealmList()
    @Required
    var intRequiredArray: RealmList<Long> = RealmList()
    @Required
    var floatRequiredArray: RealmList<Float> = RealmList()
    @Required
    var doubleRequiredArray: RealmList<Double> = RealmList()
    @Required
    var stringRequiredArray: RealmList<String> = RealmList()
    @Required
    var dateRequiredArray: RealmList<Date> = RealmList()
    @Required
    var dataRequiredArray: RealmList<ByteArray> = RealmList()
    @Required
    var objectIdRequiredArray: RealmList<ObjectId> = RealmList()
    @Required
    var decimal128RequiredArray: RealmList<Decimal128> = RealmList()
    var objectRequiredArray: RealmList<RequiredTypes> = RealmList()

}

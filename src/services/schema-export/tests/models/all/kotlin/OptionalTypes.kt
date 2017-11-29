// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here

import io.realm.RealmList
import io.realm.RealmObject
import java.util.Date

open class OptionalTypes : RealmObject() {

    var isBoolOptional: Boolean? = null
    var intOptional: Long? = null
    var floatOptional: Float? = null
    var doubleOptional: Double? = null
    var stringOptional: String? = null
    var dateOptional: Date? = null
    var dataOptional: ByteArray? = null
    var objectOptional: RequiredTypes? = null
    var boolOptionalArray: RealmList<Boolean>? = null
    var intOptionalArray: RealmList<Long>? = null
    var floatOptionalArray: RealmList<Float>? = null
    var doubleOptionalArray: RealmList<Double>? = null
    var stringOptionalArray: RealmList<String>? = null
    var dateOptionalArray: RealmList<Date>? = null
    var dataOptionalArray: RealmList<ByteArray>? = null

}

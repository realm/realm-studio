// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here

import io.realm.annotations.Index
import io.realm.annotations.PrimaryKey
import io.realm.RealmObject
import java.util.Date

open class IndexedTypes : RealmObject() {

    @Index
    var isBoolIndexed: Boolean = false
    @PrimaryKey
    var intIndexed: Long = 0
    @Index
    var stringIndexed: String = ""
    @Index
    var dateIndexed: Date = Date()

}

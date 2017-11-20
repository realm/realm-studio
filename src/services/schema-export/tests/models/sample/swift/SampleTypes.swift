import Foundation
import RealmSwift

class SampleTypes: Object {
    dynamic var primary = 0
    let ArrayFloatValue = RealmOptional<Float>()
    let listOfStrings = List<String>()
    let listOfOptionalDates = List<NSDate?>()
    dynamic var indexedInt = 0
    dynamic var linkToObject: SampleTypes?
    /* Error! 'Any' properties are unsupported in Swift. */

    override static func primaryKey() -> String? {
        return "primary"
    }

    override static func indexedProperties() -> [String] {
        return ["indexedInt"]
    }
}

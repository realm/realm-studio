import Foundation
import RealmSwift

class SampleTypes: Object {
    @objc dynamic var primary: Int = 0
    let ArrayFloatValue = RealmOptional<Float>()
    let listOfStrings = List<String>()
    let listOfOptionalDates = List<Date?>()
    @objc dynamic var indexedInt: Int = 0
    @objc dynamic var linkToObject: SampleTypes?
    let listOfObjects = List<SampleTypes>()

    override static func primaryKey() -> String? {
        return "primary"
    }

    override static func indexedProperties() -> [String] {
        return ["indexedInt"]
    }
}


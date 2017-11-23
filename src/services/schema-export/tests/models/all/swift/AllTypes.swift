import Foundation
import RealmSwift

class IndexedTypes: Object {
    @objc dynamic var boolIndexed: Bool = false
    @objc dynamic var intIndexed: Int = 0
    @objc dynamic var stringIndexed: String = ""
    @objc dynamic var dateIndexed: Date = Date()

    override static func primaryKey() -> String? {
        return "intIndexed"
    }

    override static func indexedProperties() -> [String] {
        return ["boolIndexed", "stringIndexed", "dateIndexed"]
    }
}

class LinkTypes: Object {
    @objc dynamic var objectType: ReverseType?
    @objc dynamic var objectType2: ReverseType?
    let listType = List<ReverseType>()
}

class OptionalTypes: Object {
    let boolOptional = RealmOptional<Bool>()
    let intOptional = RealmOptional<Int>()
    let floatOptional = RealmOptional<Float>()
    let doubleOptional = RealmOptional<Double>()
    @objc dynamic var stringOptional: String? = nil
    @objc dynamic var dateOptional: Date? = nil
    @objc dynamic var dataOptional: Data? = nil
    @objc dynamic var objectOptional: RequiredTypes?
    let boolOptionalArray = List<Bool?>()
    let intOptionalArray = List<Int?>()
    let floatOptionalArray = List<Float?>()
    let doubleOptionalArray = List<Double?>()
    let stringOptionalArray = List<String?>()
    let dateOptionalArray = List<Date?>()
    let dataOptionalArray = List<Data?>()
}

class RequiredTypes: Object {
    @objc dynamic var boolRequired: Bool = false
    @objc dynamic var intRequired: Int = 0
    @objc dynamic var floatRequired: Float = 0
    @objc dynamic var doubleRequired: Double = 0
    @objc dynamic var stringRequired: String = ""
    @objc dynamic var dateRequired: Date = Date()
    @objc dynamic var dataRequired: Data = Data()
    let boolRequiredArray = List<Bool>()
    let intRequiredArray = List<Int>()
    let floatRequiredArray = List<Float>()
    let doubleRequiredArray = List<Double>()
    let stringRequiredArray = List<String>()
    let dateRequiredArray = List<Date>()
    let dataRequiredArray = List<Data>()
    let objectRequiredArray = List<RequiredTypes>()
}

class ReverseType: Object {
    @objc dynamic var links: LinkTypes?
}


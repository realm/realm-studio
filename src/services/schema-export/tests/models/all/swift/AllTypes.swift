import Foundation
import RealmSwift

class ChildEmbeddedType: Object {
    @objc dynamic var id: Int = 0
}

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
    @objc dynamic var objectIdOptional: ObjectId? = nil
    @objc dynamic var decimal128Optional: Decimal128? = nil
    @objc dynamic var objectOptional: RequiredTypes?
    let boolOptionalArray = List<Bool?>()
    let intOptionalArray = List<Int?>()
    let floatOptionalArray = List<Float?>()
    let doubleOptionalArray = List<Double?>()
    let stringOptionalArray = List<String?>()
    let dateOptionalArray = List<Date?>()
    let dataOptionalArray = List<Data?>()
    let objectIdOptionalArray = List<ObjectId?>()
    let decimal128OptionalArray = List<Decimal128?>()
}

class ParentEmbeddedType: Object {
    @objc dynamic var objectType: ChildEmbeddedType?
    let listType = List<ChildEmbeddedType>()
}

class RequiredTypes: Object {
    @objc dynamic var boolRequired: Bool = false
    @objc dynamic var intRequired: Int = 0
    @objc dynamic var floatRequired: Float = 0
    @objc dynamic var doubleRequired: Double = 0
    @objc dynamic var stringRequired: String = ""
    @objc dynamic var dateRequired: Date = Date()
    @objc dynamic var dataRequired: Data = Data()
    @objc dynamic var objectIdRequired: ObjectId = ObjectId()
    @objc dynamic var decimal128Required: Decimal128 = Decimal128()
    let boolRequiredArray = List<Bool>()
    let intRequiredArray = List<Int>()
    let floatRequiredArray = List<Float>()
    let doubleRequiredArray = List<Double>()
    let stringRequiredArray = List<String>()
    let dateRequiredArray = List<Date>()
    let dataRequiredArray = List<Data>()
    let objectIdRequiredArray = List<ObjectId>()
    let decimal128RequiredArray = List<Decimal128>()
    let objectRequiredArray = List<RequiredTypes>()
}

class ReverseType: Object {
    @objc dynamic var links: LinkTypes?
}


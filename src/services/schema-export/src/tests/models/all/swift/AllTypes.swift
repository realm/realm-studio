import Foundation
import RealmSwift

class IndexedTypes: Object {
  dynamic var boolIndexed = false
  dynamic var intIndexed = 0
  dynamic var stringIndexed = ""
  dynamic var dateIndexed = NSDate()

  override static func indexedProperties() -> [String] {
    return [
      "boolIndexed",
      "intIndexed",
      "stringIndexed",
      "dateIndexed",
    ]
  }
}

class LinkTypes: Object {
  dynamic var objectType: ReverseType?
  dynamic var objectType2: ReverseType?
  /* Error! 'Any' properties are unsupported in Swift. */
}

class OptionalTypes: Object {
  let boolOptional = RealmOptional<Bool>()
  let intOptional = RealmOptional<Int>()
  let floatOptional = RealmOptional<Float>()
  let doubleOptional = RealmOptional<Double>()
  dynamic var stringOptional: String?
  dynamic var dateOptional: NSDate?
  dynamic var dataOptional: NSData?
  dynamic var objectOptional: RequiredTypes?
  let boolOptionalArray = List<Bool?>()
  let intOptionalArray = List<Int?>()
  let floatOptionalArray = List<Float?>()
  let doubleOptionalArray = List<Double?>()
  let stringOptionalArray = List<String?>()
  let dateOptionalArray = List<NSDate?>()
  let dataOptionalArray = List<NSData?>()
}

class RequiredTypes: Object {
  dynamic var boolRequired = false
  dynamic var intRequired = 0
  dynamic var floatRequired: Float = 0
  dynamic var doubleRequired: Double = 0
  dynamic var stringRequired = ""
  dynamic var dateRequired = NSDate()
  dynamic var dataRequired = NSData()
  let boolRequiredArray = List<Bool>()
  let intRequiredArray = List<Int>()
  let floatRequiredArray = List<Float>()
  let doubleRequiredArray = List<Double>()
  let stringRequiredArray = List<String>()
  let dateRequiredArray = List<NSDate>()
  let dataRequiredArray = List<NSData>()
  /* Error! 'Any' properties are unsupported in Swift. */
}

class ReverseType: Object {
  dynamic var links: LinkTypes?
}


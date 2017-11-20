import Foundation
import RealmSwift

class RealmTestClass0: Object {
    @objc dynamic var integerValue: Int = 0
    @objc dynamic var stringValue: String? = nil
    @objc dynamic var dataValue: Data? = nil
}

class RealmTestClass1: Object {
    @objc dynamic var integerValue: Int = 0
    @objc dynamic var boolValue: Bool = false
    @objc dynamic var floatValue: Float = 0
    @objc dynamic var doubleValue: Double = 0
    @objc dynamic var stringValue: String? = nil
    @objc dynamic var dateValue: Date? = nil
    let arrayReference = List<RealmTestClass0>()
}

class RealmTestClass2: Object {
    @objc dynamic var integerValue: Int = 0
    @objc dynamic var boolValue: Bool = false
    @objc dynamic var objectReference: RealmTestClass1?
}


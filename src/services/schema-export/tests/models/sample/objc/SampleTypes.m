#import "RealmModels.h"

@implementation SampleTypes

+ (NSArray<NSString *> *)requiredProperties {
    return @[
        @"listOfStrings",
        @"listOfObjects",
    ];
}

+ (NSString *)primaryKey {
    return @"primary";
}

+ (NSArray<NSString *> *)indexedProperties {
    return @[
        @"indexedInt",
    ];
}

@end



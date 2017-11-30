#import "RealmModels.h"

@implementation IndexedTypes

+ (NSArray<NSString *> *)requiredProperties {
    return @[
        @"stringIndexed",
        @"dateIndexed",
    ];
}

+ (NSArray<NSString *> *)indexedProperties {
    return @[
        @"boolIndexed",
        @"intIndexed",
        @"stringIndexed",
        @"dateIndexed",
    ];
}

@end


@implementation LinkTypes

+ (NSArray<NSString *> *)requiredProperties {
    return @[
        @"listType",
    ];
}

@end


@implementation OptionalTypes

@end


@implementation RequiredTypes

+ (NSArray<NSString *> *)requiredProperties {
    return @[
        @"stringRequired",
        @"dateRequired",
        @"dataRequired",
        @"stringRequiredArray",
        @"dateRequiredArray",
        @"dataRequiredArray",
        @"objectRequiredArray",
    ];
}

@end


@implementation ReverseType

@end



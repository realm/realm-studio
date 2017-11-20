#import <Foundation/Foundation.h>
#import <Realm/Realm.h>

@interface IndexedTypes : RLMObject
@end

@interface LinkTypes : RLMObject
@end

@interface OptionalTypes : RLMObject
@end

@interface RequiredTypes : RLMObject
@end

@interface ReverseType : RLMObject
@end


RLM_ARRAY_TYPE(IndexedTypes)
RLM_ARRAY_TYPE(LinkTypes)
RLM_ARRAY_TYPE(OptionalTypes)
RLM_ARRAY_TYPE(RequiredTypes)
RLM_ARRAY_TYPE(ReverseType)


NS_ASSUME_NONNULL_BEGIN

@interface IndexedTypes()

@property BOOL boolIndexed;
@property NSInteger intIndexed;
@property NSString *stringIndexed;
@property NSDate *dateIndexed;

@end

@interface LinkTypes()

@property (nullable) ReverseType *objectType;
@property (nullable) ReverseType *objectType2;
@property RLMArray<ReverseType *><ReverseType> *listType;

@end

@interface OptionalTypes()

@property (nullable) NSNumber<RLMBool> *boolOptional;
@property (nullable) NSNumber<RLMInt> *intOptional;
@property (nullable) NSNumber<RLMFloat> *floatOptional;
@property (nullable) NSNumber<RLMDouble> *doubleOptional;
@property (nullable) NSString *stringOptional;
@property (nullable) NSDate *dateOptional;
@property (nullable) NSData *dataOptional;
@property (nullable) RequiredTypes *objectOptional;
@property (nullable) RLMArray<NSNumber *><RLMBool> *boolOptionalArray;
@property (nullable) RLMArray<NSNumber *><RLMInt> *intOptionalArray;
@property (nullable) RLMArray<NSNumber *><RLMFloat> *floatOptionalArray;
@property (nullable) RLMArray<NSNumber *><RLMDouble> *doubleOptionalArray;
@property (nullable) RLMArray<NSString *><RLMString> *stringOptionalArray;
@property (nullable) RLMArray<NSDate *><RLMDate> *dateOptionalArray;
@property (nullable) RLMArray<NSData *><RLMData> *dataOptionalArray;

@end

@interface RequiredTypes()

@property BOOL boolRequired;
@property NSInteger intRequired;
@property float floatRequired;
@property double doubleRequired;
@property NSString *stringRequired;
@property NSDate *dateRequired;
@property NSData *dataRequired;
@property RLMArray<NSNumber *><RLMBool> *boolRequiredArray;
@property RLMArray<NSNumber *><RLMInt> *intRequiredArray;
@property RLMArray<NSNumber *><RLMFloat> *floatRequiredArray;
@property RLMArray<NSNumber *><RLMDouble> *doubleRequiredArray;
@property RLMArray<NSString *><RLMString> *stringRequiredArray;
@property RLMArray<NSDate *><RLMDate> *dateRequiredArray;
@property RLMArray<NSData *><RLMData> *dataRequiredArray;
@property RLMArray<RequiredTypes *><RequiredTypes> *objectRequiredArray;

@end

@interface ReverseType()

@property (nullable) LinkTypes *links;

@end

NS_ASSUME_NONNULL_END

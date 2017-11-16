#import <Foundation/Foundation.h>
#import <Realm/Realm.h>

@interface SampleTypes : RLMObject
@end


RLM_ARRAY_TYPE(SampleTypes)


NS_ASSUME_NONNULL_BEGIN

@interface SampleTypes()

@property NSInteger primary;
@property (nullable) NSNumber<RLMFloat> *ArrayFloatValue;
@property RLMArray<NSString *><RLMString> *listOfStrings;
@property (nullable) RLMArray<NSDate *><RLMDate> *listOfOptionalDates;
@property NSInteger indexedInt;
@property (nullable) SampleTypes *linkToObject;
@property RLMArray<SampleTypes *><SampleTypes> *listOfObjects;

@end

NS_ASSUME_NONNULL_END

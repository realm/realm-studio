using System;
using System.Collections.Generic;
using Realms;

public class IndexedTypes : RealmObject
{
    [Indexed]
    [MapTo("boolIndexed")]
    public bool BoolIndexed { get; set; }

    [Indexed]
    [MapTo("intIndexed")]
    public long IntIndexed { get; set; }

    [Indexed]
    [MapTo("stringIndexed")]
    public string StringIndexed { get; set; }

    [Indexed]
    [MapTo("dateIndexed")]
    public DateTimeOffset DateIndexed { get; set; }
}

public class LinkTypes : RealmObject
{
    [MapTo("objectType")]
    public ReverseType ObjectType { get; set; }

    [MapTo("objectType2")]
    public ReverseType ObjectType2 { get; set; }

    [MapTo("listType")]
    public IList<ReverseType> ListType { get; }
}

public class OptionalTypes : RealmObject
{
    [MapTo("boolOptional")]
    public bool? BoolOptional { get; set; }

    [MapTo("intOptional")]
    public long? IntOptional { get; set; }

    [MapTo("floatOptional")]
    public float? FloatOptional { get; set; }

    [MapTo("doubleOptional")]
    public double? DoubleOptional { get; set; }

    [MapTo("stringOptional")]
    public string StringOptional { get; set; }

    [MapTo("dateOptional")]
    public DateTimeOffset? DateOptional { get; set; }

    [MapTo("dataOptional")]
    public byte[] DataOptional { get; set; }

    [MapTo("objectOptional")]
    public RequiredTypes ObjectOptional { get; set; }

    [MapTo("boolOptionalArray")]
    public IList<bool?> BoolOptionalArray { get; }

    [MapTo("intOptionalArray")]
    public IList<long?> IntOptionalArray { get; }

    [MapTo("floatOptionalArray")]
    public IList<float?> FloatOptionalArray { get; }

    [MapTo("doubleOptionalArray")]
    public IList<double?> DoubleOptionalArray { get; }

    [MapTo("stringOptionalArray")]
    public IList<string> StringOptionalArray { get; }

    [MapTo("dateOptionalArray")]
    public IList<DateTimeOffset?> DateOptionalArray { get; }

    [MapTo("dataOptionalArray")]
    public IList<byte[]> DataOptionalArray { get; }
}

public class RequiredTypes : RealmObject
{
    [MapTo("boolRequired")]
    public bool BoolRequired { get; set; }

    [MapTo("intRequired")]
    public long IntRequired { get; set; }

    [MapTo("floatRequired")]
    public float FloatRequired { get; set; }

    [MapTo("doubleRequired")]
    public double DoubleRequired { get; set; }

    [Required]
    [MapTo("stringRequired")]
    public string StringRequired { get; set; }

    [MapTo("dateRequired")]
    public DateTimeOffset DateRequired { get; set; }

    [Required]
    [MapTo("dataRequired")]
    public byte[] DataRequired { get; set; }

    [MapTo("boolRequiredArray")]
    public IList<bool> BoolRequiredArray { get; }

    [MapTo("intRequiredArray")]
    public IList<long> IntRequiredArray { get; }

    [MapTo("floatRequiredArray")]
    public IList<float> FloatRequiredArray { get; }

    [MapTo("doubleRequiredArray")]
    public IList<double> DoubleRequiredArray { get; }

    [Required]
    [MapTo("stringRequiredArray")]
    public IList<string> StringRequiredArray { get; }

    [MapTo("dateRequiredArray")]
    public IList<DateTimeOffset> DateRequiredArray { get; }

    [Required]
    [MapTo("dataRequiredArray")]
    public IList<byte[]> DataRequiredArray { get; }

    [MapTo("objectRequiredArray")]
    public IList<RequiredTypes> ObjectRequiredArray { get; }
}

public class ReverseType : RealmObject
{
    [MapTo("links")]
    public LinkTypes Links { get; set; }
}

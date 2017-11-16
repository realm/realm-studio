using System;
using System.Collections.Generic;
using Realms;

public class IndexedTypes : RealmObject
{
    public bool boolIndexed { get; set; }

    public long intIndexed { get; set; }

    [Required]
    public string stringIndexed { get; set; }

    public DateTimeOffset dateIndexed { get; set; }
}

public class LinkTypes : RealmObject
{
    public ReverseType objectType { get; set; }

    public ReverseType objectType2 { get; set; }

    [Required]
    public IList<ReverseType> listType { get; }
}

public class OptionalTypes : RealmObject
{
    public bool? boolOptional { get; set; }

    public long? intOptional { get; set; }

    public float? floatOptional { get; set; }

    public double? doubleOptional { get; set; }

    public string stringOptional { get; set; }

    public DateTimeOffset? dateOptional { get; set; }

    public byte[] dataOptional { get; set; }

    public RequiredTypes objectOptional { get; set; }

    public IList<bool?> boolOptionalArray { get; }

    public IList<long?> intOptionalArray { get; }

    public IList<float?> floatOptionalArray { get; }

    public IList<double?> doubleOptionalArray { get; }

    public IList<string> stringOptionalArray { get; }

    public IList<DateTimeOffset?> dateOptionalArray { get; }

    public IList<byte[]> dataOptionalArray { get; }
}

public class RequiredTypes : RealmObject
{
    public bool boolRequired { get; set; }

    public long intRequired { get; set; }

    public float floatRequired { get; set; }

    public double doubleRequired { get; set; }

    [Required]
    public string stringRequired { get; set; }

    public DateTimeOffset dateRequired { get; set; }

    [Required]
    public byte[] dataRequired { get; set; }

    public IList<bool> boolRequiredArray { get; }

    public IList<long> intRequiredArray { get; }

    public IList<float> floatRequiredArray { get; }

    public IList<double> doubleRequiredArray { get; }

    [Required]
    public IList<string> stringRequiredArray { get; }

    public IList<DateTimeOffset> dateRequiredArray { get; }

    [Required]
    public IList<byte[]> dataRequiredArray { get; }

    [Required]
    public IList<RequiredTypes> objectRequiredArray { get; }
}

public class ReverseType : RealmObject
{
    public LinkTypes links { get; set; }
}

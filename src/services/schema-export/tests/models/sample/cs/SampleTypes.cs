using System;
using System.Collections.Generic;
using Realms;

public class SampleTypes : RealmObject
{
    [PrimaryKey]
    public long primary { get; set; }

    public float? ArrayFloatValue { get; set; }

    [Required]
    public IList<string> listOfStrings { get; }

    public IList<DateTimeOffset?> listOfOptionalDates { get; }

    public long indexedInt { get; set; }

    public SampleTypes linkToObject { get; set; }

    [Required]
    public IList<SampleTypes> listOfObjects { get; }
}

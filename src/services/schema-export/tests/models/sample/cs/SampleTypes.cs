// Please note : [Backlink] properties and default values are not represented
// in the schema and thus will not be part of the generated models

using System;
using System.Collections.Generic;
using Realms;

namespace MyProject.Models
{
    public class SampleTypes : RealmObject
    {
        [PrimaryKey]
        [MapTo("primary")]
        public long Primary { get; set; }

        public float? ArrayFloatValue { get; set; }

        [Required]
        [MapTo("listOfStrings")]
        public IList<string> ListOfStrings { get; }

        [MapTo("listOfOptionalDates")]
        public IList<DateTimeOffset?> ListOfOptionalDates { get; }

        [Indexed]
        [MapTo("indexedInt")]
        public long IndexedInt { get; set; }

        [MapTo("linkToObject")]
        public SampleTypes LinkToObject { get; set; }

        [MapTo("listOfObjects")]
        public IList<SampleTypes> ListOfObjects { get; }
    }
}

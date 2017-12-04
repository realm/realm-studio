// Please note : [Backlink] properties and default values are not represented
// in the schema and thus will not be part of the generated models

using System;
using System.Collections.Generic;
using Realms;

namespace MyProject.Models
{
    public class IndexedTypes : RealmObject
    {
        [Indexed]
        [MapTo("boolIndexed")]
        public bool BoolIndexed { get; set; }

        [PrimaryKey]
        [MapTo("intIndexed")]
        public long IntIndexed { get; set; }

        [Indexed]
        [Required]
        [MapTo("stringIndexed")]
        public string StringIndexed { get; set; }

        [Indexed]
        [MapTo("dateIndexed")]
        public DateTimeOffset DateIndexed { get; set; }
    }
}

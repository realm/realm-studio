// Please note : [Backlink] properties and default values are not represented
// in the schema and thus will not be part of the generated models

using System;
using System.Collections.Generic;
using Realms;

namespace MyProject.Models
{
    public class LinkTypes : RealmObject
    {
        [MapTo("objectType")]
        public ReverseType ObjectType { get; set; }

        [MapTo("objectType2")]
        public ReverseType ObjectType2 { get; set; }

        [MapTo("listType")]
        public IList<ReverseType> ListType { get; }
    }
}

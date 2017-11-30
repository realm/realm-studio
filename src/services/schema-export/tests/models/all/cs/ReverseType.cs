// Please note : [Backlink] properties and default values are not represented
// in the schema and thus will not be part of the generated models

using System;
using System.Collections.Generic;
using Realms;

namespace MyProject.Models
{
    public class ReverseType : RealmObject
    {
        [MapTo("links")]
        public LinkTypes Links { get; set; }
    }
}

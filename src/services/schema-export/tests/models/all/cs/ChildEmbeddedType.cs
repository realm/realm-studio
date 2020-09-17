// Please note : [Backlink] properties and default values are not represented
// in the schema and thus will not be part of the generated models

using System;
using System.Collections.Generic;
using Realms;

namespace MyProject.Models
{
    public class ChildEmbeddedType : RealmObject
    {
        [MapTo("id")]
        public long Id { get; set; }
    }
}

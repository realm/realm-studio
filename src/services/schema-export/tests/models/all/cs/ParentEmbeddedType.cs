// Please note : [Backlink] properties and default values are not represented
// in the schema and thus will not be part of the generated models

using System;
using System.Collections.Generic;
using Realms;

namespace MyProject.Models
{
    public class ParentEmbeddedType : RealmObject
    {
        [MapTo("embeddedObject")]
        public ChildEmbeddedType EmbeddedObject { get; set; }

        [MapTo("embeddedObjectList")]
        public IList<ChildEmbeddedType> EmbeddedObjectList { get; }
    }
}

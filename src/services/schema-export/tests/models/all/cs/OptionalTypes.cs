// Please note : [Backlink] properties and default values are not represented
// in the schema and thus will not be part of the generated models

using System;
using System.Collections.Generic;
using Realms;

namespace MyProject.Models
{
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

        [MapTo("objectIdOptional")]
        public ObjectId ObjectIdOptional { get; set; }

        [MapTo("decimal128Optional")]
        public Decimal128 Decimal128Optional { get; set; }

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

        [MapTo("objectIdOptionalArray")]
        public IList<ObjectId> ObjectIdOptionalArray { get; }

        [MapTo("decimal128OptionalArray")]
        public IList<Decimal128> Decimal128OptionalArray { get; }
    }
}

// Please note : [Backlink] properties and default values are not represented
// in the schema and thus will not be part of the generated models

using System;
using System.Collections.Generic;
using Realms;
using MongoDB.Bson;

namespace MyProject.Models
{
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

        [MapTo("objectIdRequired")]
        public ObjectId ObjectIdRequired { get; set; }

        [MapTo("decimal128Required")]
        public Decimal128 Decimal128Required { get; set; }

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

        [MapTo("objectIdRequiredArray")]
        public IList<ObjectId> ObjectIdRequiredArray { get; }

        [MapTo("decimal128RequiredArray")]
        public IList<Decimal128> Decimal128RequiredArray { get; }

        [MapTo("objectRequiredArray")]
        public IList<RequiredTypes> ObjectRequiredArray { get; }
    }
}

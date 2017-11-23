// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here;

import io.realm.RealmObject;
import java.util.Date;
import io.realm.RealmList;

public class OptionalTypes extends RealmObject {
    private Boolean boolOptional;
    private Long intOptional;
    private Float floatOptional;
    private Double doubleOptional;
    private String stringOptional;
    private Date dateOptional;
    private byte[] dataOptional;
    private RequiredTypes objectOptional;
    private RealmList<Boolean> boolOptionalArray;
    private RealmList<Long> intOptionalArray;
    private RealmList<Float> floatOptionalArray;
    private RealmList<Double> doubleOptionalArray;
    private RealmList<String> stringOptionalArray;
    private RealmList<Date> dateOptionalArray;
    private RealmList<byte[]> dataOptionalArray;

    public Boolean isBoolOptional() { return boolOptional; }

    public void setBoolOptional(Boolean boolOptional) { this.boolOptional = boolOptional; }

    public Long getIntOptional() { return intOptional; }

    public void setIntOptional(Long intOptional) { this.intOptional = intOptional; }

    public Float getFloatOptional() { return floatOptional; }

    public void setFloatOptional(Float floatOptional) { this.floatOptional = floatOptional; }

    public Double getDoubleOptional() { return doubleOptional; }

    public void setDoubleOptional(Double doubleOptional) { this.doubleOptional = doubleOptional; }

    public String getStringOptional() { return stringOptional; }

    public void setStringOptional(String stringOptional) { this.stringOptional = stringOptional; }

    public Date getDateOptional() { return dateOptional; }

    public void setDateOptional(Date dateOptional) { this.dateOptional = dateOptional; }

    public byte[] getDataOptional() { return dataOptional; }

    public void setDataOptional(byte[] dataOptional) { this.dataOptional = dataOptional; }

    public RequiredTypes getObjectOptional() { return objectOptional; }

    public void setObjectOptional(RequiredTypes objectOptional) { this.objectOptional = objectOptional; }

    public RealmList<Boolean> getBoolOptionalArray() { return boolOptionalArray; }

    public void setBoolOptionalArray(RealmList<Boolean> boolOptionalArray) { this.boolOptionalArray = boolOptionalArray; }

    public RealmList<Long> getIntOptionalArray() { return intOptionalArray; }

    public void setIntOptionalArray(RealmList<Long> intOptionalArray) { this.intOptionalArray = intOptionalArray; }

    public RealmList<Float> getFloatOptionalArray() { return floatOptionalArray; }

    public void setFloatOptionalArray(RealmList<Float> floatOptionalArray) { this.floatOptionalArray = floatOptionalArray; }

    public RealmList<Double> getDoubleOptionalArray() { return doubleOptionalArray; }

    public void setDoubleOptionalArray(RealmList<Double> doubleOptionalArray) { this.doubleOptionalArray = doubleOptionalArray; }

    public RealmList<String> getStringOptionalArray() { return stringOptionalArray; }

    public void setStringOptionalArray(RealmList<String> stringOptionalArray) { this.stringOptionalArray = stringOptionalArray; }

    public RealmList<Date> getDateOptionalArray() { return dateOptionalArray; }

    public void setDateOptionalArray(RealmList<Date> dateOptionalArray) { this.dateOptionalArray = dateOptionalArray; }

    public RealmList<byte[]> getDataOptionalArray() { return dataOptionalArray; }

    public void setDataOptionalArray(RealmList<byte[]> dataOptionalArray) { this.dataOptionalArray = dataOptionalArray; }


}

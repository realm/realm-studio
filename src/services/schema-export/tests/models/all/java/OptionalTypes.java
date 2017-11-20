package your.package.name.here;

import io.realm.RealmObject;
import io.realm.RealmList;
import RequiredTypes;

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

    public Boolean isBooloptional() { return boolOptional; }

    public void setBooloptional(Boolean boolOptional) { this.boolOptional = boolOptional; } 

    public Long getIntoptional() { return intOptional; }

    public void setIntoptional(Long intOptional) { this.intOptional = intOptional; } 

    public Float getFloatoptional() { return floatOptional; }

    public void setFloatoptional(Float floatOptional) { this.floatOptional = floatOptional; } 

    public Double getDoubleoptional() { return doubleOptional; }

    public void setDoubleoptional(Double doubleOptional) { this.doubleOptional = doubleOptional; } 

    public String getStringoptional() { return stringOptional; }

    public void setStringoptional(String stringOptional) { this.stringOptional = stringOptional; } 

    public Date getDateoptional() { return dateOptional; }

    public void setDateoptional(Date dateOptional) { this.dateOptional = dateOptional; } 

    public byte[] getDataoptional() { return dataOptional; }

    public void setDataoptional(byte[] dataOptional) { this.dataOptional = dataOptional; } 

    public RequiredTypes getObjectoptional() { return objectOptional; }

    public void setObjectoptional(RequiredTypes objectOptional) { this.objectOptional = objectOptional; } 

    public RealmList<Boolean> isBooloptionalarray() { return boolOptionalArray; }

    public void setBooloptionalarray(RealmList<Boolean> boolOptionalArray) { this.boolOptionalArray = boolOptionalArray; } 

    public RealmList<Long> getIntoptionalarray() { return intOptionalArray; }

    public void setIntoptionalarray(RealmList<Long> intOptionalArray) { this.intOptionalArray = intOptionalArray; } 

    public RealmList<Float> getFloatoptionalarray() { return floatOptionalArray; }

    public void setFloatoptionalarray(RealmList<Float> floatOptionalArray) { this.floatOptionalArray = floatOptionalArray; } 

    public RealmList<Double> getDoubleoptionalarray() { return doubleOptionalArray; }

    public void setDoubleoptionalarray(RealmList<Double> doubleOptionalArray) { this.doubleOptionalArray = doubleOptionalArray; } 

    public RealmList<String> getStringoptionalarray() { return stringOptionalArray; }

    public void setStringoptionalarray(RealmList<String> stringOptionalArray) { this.stringOptionalArray = stringOptionalArray; } 

    public RealmList<Date> getDateoptionalarray() { return dateOptionalArray; }

    public void setDateoptionalarray(RealmList<Date> dateOptionalArray) { this.dateOptionalArray = dateOptionalArray; } 

    public RealmList<byte[]> getDataoptionalarray() { return dataOptionalArray; }

    public void setDataoptionalarray(RealmList<byte[]> dataOptionalArray) { this.dataOptionalArray = dataOptionalArray; } 

}

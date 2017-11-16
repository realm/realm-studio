package your.package.name.here;

import io.realm.RealmObject;
import io.realm.annotations.Required;
import io.realm.RealmList;
import RequiredTypes;

public class RequiredTypes extends RealmObject {
    private boolean boolRequired;
    private long intRequired;
    private float floatRequired;
    private double doubleRequired;
    @Required
    private String stringRequired;
    @Required
    private Date dateRequired;
    @Required
    private byte[] dataRequired;
    private RealmList<Boolean> boolRequiredArray;
    private RealmList<Long> intRequiredArray;
    private RealmList<Float> floatRequiredArray;
    private RealmList<Double> doubleRequiredArray;
    @Required
    private RealmList<String> stringRequiredArray;
    @Required
    private RealmList<Date> dateRequiredArray;
    @Required
    private RealmList<byte[]> dataRequiredArray;
    private RealmList<RequiredTypes> objectRequiredArray;

    public boolean isBoolrequired() { return boolRequired; }

    public void setBoolrequired(boolean boolRequired) { this.boolRequired = boolRequired; } 

    public long getIntrequired() { return intRequired; }

    public void setIntrequired(long intRequired) { this.intRequired = intRequired; } 

    public float getFloatrequired() { return floatRequired; }

    public void setFloatrequired(float floatRequired) { this.floatRequired = floatRequired; } 

    public double getDoublerequired() { return doubleRequired; }

    public void setDoublerequired(double doubleRequired) { this.doubleRequired = doubleRequired; } 

    public String getStringrequired() { return stringRequired; }

    public void setStringrequired(String stringRequired) { this.stringRequired = stringRequired; } 

    public Date getDaterequired() { return dateRequired; }

    public void setDaterequired(Date dateRequired) { this.dateRequired = dateRequired; } 

    public byte[] getDatarequired() { return dataRequired; }

    public void setDatarequired(byte[] dataRequired) { this.dataRequired = dataRequired; } 

    public RealmList<Boolean> isBoolrequiredarray() { return boolRequiredArray; }

    public void setBoolrequiredarray(RealmList<Boolean> boolRequiredArray) { this.boolRequiredArray = boolRequiredArray; } 

    public RealmList<Long> getIntrequiredarray() { return intRequiredArray; }

    public void setIntrequiredarray(RealmList<Long> intRequiredArray) { this.intRequiredArray = intRequiredArray; } 

    public RealmList<Float> getFloatrequiredarray() { return floatRequiredArray; }

    public void setFloatrequiredarray(RealmList<Float> floatRequiredArray) { this.floatRequiredArray = floatRequiredArray; } 

    public RealmList<Double> getDoublerequiredarray() { return doubleRequiredArray; }

    public void setDoublerequiredarray(RealmList<Double> doubleRequiredArray) { this.doubleRequiredArray = doubleRequiredArray; } 

    public RealmList<String> getStringrequiredarray() { return stringRequiredArray; }

    public void setStringrequiredarray(RealmList<String> stringRequiredArray) { this.stringRequiredArray = stringRequiredArray; } 

    public RealmList<Date> getDaterequiredarray() { return dateRequiredArray; }

    public void setDaterequiredarray(RealmList<Date> dateRequiredArray) { this.dateRequiredArray = dateRequiredArray; } 

    public RealmList<byte[]> getDatarequiredarray() { return dataRequiredArray; }

    public void setDatarequiredarray(RealmList<byte[]> dataRequiredArray) { this.dataRequiredArray = dataRequiredArray; } 

    public RealmList<RequiredTypes> getObjectrequiredarray() { return objectRequiredArray; }

    public void setObjectrequiredarray(RealmList<RequiredTypes> objectRequiredArray) { this.objectRequiredArray = objectRequiredArray; } 

}

// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here;

import io.realm.RealmObject;
import io.realm.annotations.Required;
import java.util.Date;
import org.bson.types.ObjectId;
import org.bson.types.Decimal128;
import io.realm.RealmList;

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
    @Required
    private ObjectId objectIdRequired;
    @Required
    private Decimal128 decimal128Required;
    @Required
    private RealmList<Boolean> boolRequiredArray;
    @Required
    private RealmList<Long> intRequiredArray;
    @Required
    private RealmList<Float> floatRequiredArray;
    @Required
    private RealmList<Double> doubleRequiredArray;
    @Required
    private RealmList<String> stringRequiredArray;
    @Required
    private RealmList<Date> dateRequiredArray;
    @Required
    private RealmList<byte[]> dataRequiredArray;
    @Required
    private RealmList<ObjectId> objectIdRequiredArray;
    @Required
    private RealmList<Decimal128> decimal128RequiredArray;
    private RealmList<RequiredTypes> objectRequiredArray;

    public boolean isBoolRequired() { return boolRequired; }

    public void setBoolRequired(boolean boolRequired) { this.boolRequired = boolRequired; }

    public long getIntRequired() { return intRequired; }

    public void setIntRequired(long intRequired) { this.intRequired = intRequired; }

    public float getFloatRequired() { return floatRequired; }

    public void setFloatRequired(float floatRequired) { this.floatRequired = floatRequired; }

    public double getDoubleRequired() { return doubleRequired; }

    public void setDoubleRequired(double doubleRequired) { this.doubleRequired = doubleRequired; }

    public String getStringRequired() { return stringRequired; }

    public void setStringRequired(String stringRequired) { this.stringRequired = stringRequired; }

    public Date getDateRequired() { return dateRequired; }

    public void setDateRequired(Date dateRequired) { this.dateRequired = dateRequired; }

    public byte[] getDataRequired() { return dataRequired; }

    public void setDataRequired(byte[] dataRequired) { this.dataRequired = dataRequired; }

    public ObjectId getObjectIdRequired() { return objectIdRequired; }

    public void setObjectIdRequired(ObjectId objectIdRequired) { this.objectIdRequired = objectIdRequired; }

    public Decimal128 getDecimal128Required() { return decimal128Required; }

    public void setDecimal128Required(Decimal128 decimal128Required) { this.decimal128Required = decimal128Required; }

    public RealmList<Boolean> getBoolRequiredArray() { return boolRequiredArray; }

    public void setBoolRequiredArray(RealmList<Boolean> boolRequiredArray) { this.boolRequiredArray = boolRequiredArray; }

    public RealmList<Long> getIntRequiredArray() { return intRequiredArray; }

    public void setIntRequiredArray(RealmList<Long> intRequiredArray) { this.intRequiredArray = intRequiredArray; }

    public RealmList<Float> getFloatRequiredArray() { return floatRequiredArray; }

    public void setFloatRequiredArray(RealmList<Float> floatRequiredArray) { this.floatRequiredArray = floatRequiredArray; }

    public RealmList<Double> getDoubleRequiredArray() { return doubleRequiredArray; }

    public void setDoubleRequiredArray(RealmList<Double> doubleRequiredArray) { this.doubleRequiredArray = doubleRequiredArray; }

    public RealmList<String> getStringRequiredArray() { return stringRequiredArray; }

    public void setStringRequiredArray(RealmList<String> stringRequiredArray) { this.stringRequiredArray = stringRequiredArray; }

    public RealmList<Date> getDateRequiredArray() { return dateRequiredArray; }

    public void setDateRequiredArray(RealmList<Date> dateRequiredArray) { this.dateRequiredArray = dateRequiredArray; }

    public RealmList<byte[]> getDataRequiredArray() { return dataRequiredArray; }

    public void setDataRequiredArray(RealmList<byte[]> dataRequiredArray) { this.dataRequiredArray = dataRequiredArray; }

    public RealmList<ObjectId> getObjectIdRequiredArray() { return objectIdRequiredArray; }

    public void setObjectIdRequiredArray(RealmList<ObjectId> objectIdRequiredArray) { this.objectIdRequiredArray = objectIdRequiredArray; }

    public RealmList<Decimal128> getDecimal128RequiredArray() { return decimal128RequiredArray; }

    public void setDecimal128RequiredArray(RealmList<Decimal128> decimal128RequiredArray) { this.decimal128RequiredArray = decimal128RequiredArray; }

    public RealmList<RequiredTypes> getObjectRequiredArray() { return objectRequiredArray; }

    public void setObjectRequiredArray(RealmList<RequiredTypes> objectRequiredArray) { this.objectRequiredArray = objectRequiredArray; }


}

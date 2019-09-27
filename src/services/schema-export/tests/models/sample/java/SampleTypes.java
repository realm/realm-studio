// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here;

import io.realm.RealmObject;
import io.realm.RealmList;
import io.realm.annotations.Required;
import java.util.Date;
import io.realm.annotations.Index;
import io.realm.annotations.PrimaryKey;

public class SampleTypes extends RealmObject {
    @PrimaryKey
    private long primary;
    private Float ArrayFloatValue;
    @Required
    private RealmList<String> listOfStrings;
    private RealmList<Date> listOfOptionalDates;
    @Index
    private long indexedInt;
    private SampleTypes linkToObject;
    private RealmList<SampleTypes> listOfObjects;

    public long getPrimary() { return primary; }

    public void setPrimary(long primary) { this.primary = primary; }

    public Float getArrayFloatValue() { return ArrayFloatValue; }

    public void setArrayFloatValue(Float ArrayFloatValue) { this.ArrayFloatValue = ArrayFloatValue; }

    public RealmList<String> getListOfStrings() { return listOfStrings; }

    public void setListOfStrings(RealmList<String> listOfStrings) { this.listOfStrings = listOfStrings; }

    public RealmList<Date> getListOfOptionalDates() { return listOfOptionalDates; }

    public void setListOfOptionalDates(RealmList<Date> listOfOptionalDates) { this.listOfOptionalDates = listOfOptionalDates; }

    public long getIndexedInt() { return indexedInt; }

    public void setIndexedInt(long indexedInt) { this.indexedInt = indexedInt; }

    public SampleTypes getLinkToObject() { return linkToObject; }

    public void setLinkToObject(SampleTypes linkToObject) { this.linkToObject = linkToObject; }

    public RealmList<SampleTypes> getListOfObjects() { return listOfObjects; }

    public void setListOfObjects(RealmList<SampleTypes> listOfObjects) { this.listOfObjects = listOfObjects; }


}

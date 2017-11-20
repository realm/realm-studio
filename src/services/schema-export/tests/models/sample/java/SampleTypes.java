package your.package.name.here;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.RealmList;
import io.realm.annotations.Required;
import io.realm.annotations.Index;
import SampleTypes;

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

    public Float getArrayfloatvalue() { return ArrayFloatValue; }

    public void setArrayfloatvalue(Float ArrayFloatValue) { this.ArrayFloatValue = ArrayFloatValue; } 

    public RealmList<String> getListofstrings() { return listOfStrings; }

    public void setListofstrings(RealmList<String> listOfStrings) { this.listOfStrings = listOfStrings; } 

    public RealmList<Date> getListofoptionaldates() { return listOfOptionalDates; }

    public void setListofoptionaldates(RealmList<Date> listOfOptionalDates) { this.listOfOptionalDates = listOfOptionalDates; } 

    public long getIndexedint() { return indexedInt; }

    public void setIndexedint(long indexedInt) { this.indexedInt = indexedInt; } 

    public SampleTypes getLinktoobject() { return linkToObject; }

    public void setLinktoobject(SampleTypes linkToObject) { this.linkToObject = linkToObject; } 

    public RealmList<SampleTypes> getListofobjects() { return listOfObjects; }

    public void setListofobjects(RealmList<SampleTypes> listOfObjects) { this.listOfObjects = listOfObjects; } 

}

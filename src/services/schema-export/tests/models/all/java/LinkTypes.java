// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here;

import io.realm.RealmObject;
import io.realm.RealmList;

public class LinkTypes extends RealmObject {
    private ReverseType objectType;
    private ReverseType objectType2;
    private RealmList<ReverseType> listType;

    public ReverseType getObjectType() { return objectType; }

    public void setObjectType(ReverseType objectType) { this.objectType = objectType; }

    public ReverseType getObjectType2() { return objectType2; }

    public void setObjectType2(ReverseType objectType2) { this.objectType2 = objectType2; }

    public RealmList<ReverseType> getListType() { return listType; }

    public void setListType(RealmList<ReverseType> listType) { this.listType = listType; }


}

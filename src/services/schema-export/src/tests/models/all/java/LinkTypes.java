package your.package.name.here;

import io.realm.RealmObject;
import io.realm.RealmList;
import ReverseType;

public class LinkTypes extends RealmObject {
    private ReverseType objectType;
    private ReverseType objectType2;
    private RealmList<ReverseType> listType;

    public ReverseType getObjecttype() { return objectType; }

    public void setObjecttype(ReverseType objectType) { this.objectType = objectType; } 

    public ReverseType getObjecttype2() { return objectType2; }

    public void setObjecttype2(ReverseType objectType2) { this.objectType2 = objectType2; } 

    public RealmList<ReverseType> getListtype() { return listType; }

    public void setListtype(RealmList<ReverseType> listType) { this.listType = listType; } 

}

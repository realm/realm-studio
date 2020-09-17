// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here;

import io.realm.RealmObject;
import io.realm.RealmList;

public class ParentEmbeddedType extends RealmObject {
    private ChildEmbeddedType embeddedObject;
    private RealmList<ChildEmbeddedType> embeddedObjectList;

    public ChildEmbeddedType getEmbeddedObject() { return embeddedObject; }

    public void setEmbeddedObject(ChildEmbeddedType embeddedObject) { this.embeddedObject = embeddedObject; }

    public RealmList<ChildEmbeddedType> getEmbeddedObjectList() { return embeddedObjectList; }

    public void setEmbeddedObjectList(RealmList<ChildEmbeddedType> embeddedObjectList) { this.embeddedObjectList = embeddedObjectList; }


}

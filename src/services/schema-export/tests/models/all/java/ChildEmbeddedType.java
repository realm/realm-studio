// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here;

import io.realm.RealmObject;
import io.realm.annotations.RealmClass;

@RealmClass(embedded = true)
public class ChildEmbeddedType extends RealmObject {
    private long id;

    public long getId() { return id; }

    public void setId(long id) { this.id = id; }


}

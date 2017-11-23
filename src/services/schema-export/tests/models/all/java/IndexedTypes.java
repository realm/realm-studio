// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here;

import io.realm.RealmObject;
import io.realm.annotations.Index;
import io.realm.annotations.Required;
import java.util.Date;
import io.realm.annotations.PrimaryKey;

public class IndexedTypes extends RealmObject {
    @Index
    private boolean boolIndexed;
    @PrimaryKey
    private long intIndexed;
    @Index
    @Required
    private String stringIndexed;
    @Index
    @Required
    private Date dateIndexed;

    public boolean isBoolIndexed() { return boolIndexed; }

    public void setBoolIndexed(boolean boolIndexed) { this.boolIndexed = boolIndexed; }

    public long getIntIndexed() { return intIndexed; }

    public void setIntIndexed(long intIndexed) { this.intIndexed = intIndexed; }

    public String getStringIndexed() { return stringIndexed; }

    public void setStringIndexed(String stringIndexed) { this.stringIndexed = stringIndexed; }

    public Date getDateIndexed() { return dateIndexed; }

    public void setDateIndexed(Date dateIndexed) { this.dateIndexed = dateIndexed; }


}

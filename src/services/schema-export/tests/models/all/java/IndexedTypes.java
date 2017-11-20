package your.package.name.here;

import io.realm.RealmObject;
import io.realm.annotations.Index;
import io.realm.annotations.Required;

public class IndexedTypes extends RealmObject {
    @Index
    private boolean boolIndexed;
    @Index
    private long intIndexed;
    @Index
    @Required
    private String stringIndexed;
    @Index
    @Required
    private Date dateIndexed;

    public boolean isBoolindexed() { return boolIndexed; }

    public void setBoolindexed(boolean boolIndexed) { this.boolIndexed = boolIndexed; } 

    public long getIntindexed() { return intIndexed; }

    public void setIntindexed(long intIndexed) { this.intIndexed = intIndexed; } 

    public String getStringindexed() { return stringIndexed; }

    public void setStringindexed(String stringIndexed) { this.stringIndexed = stringIndexed; } 

    public Date getDateindexed() { return dateIndexed; }

    public void setDateindexed(Date dateIndexed) { this.dateIndexed = dateIndexed; } 

}

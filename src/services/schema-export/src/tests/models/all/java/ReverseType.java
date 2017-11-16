package your.package.name.here;

import io.realm.RealmObject;
import LinkTypes;

public class ReverseType extends RealmObject {
    private LinkTypes links;

    public LinkTypes getLinks() { return links; }

    public void setLinks(LinkTypes links) { this.links = links; } 

}

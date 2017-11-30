// Please note : @LinkingObjects and default values are not represented in the schema and thus will not be part of the generated models
package your.package.name.here;

import io.realm.RealmObject;

public class ReverseType extends RealmObject {
    private LinkTypes links;

    public LinkTypes getLinks() { return links; }

    public void setLinks(LinkTypes links) { this.links = links; }


}

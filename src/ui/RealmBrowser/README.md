# The Realm Browser

By now this component is the most complex in Realm Studio and it feels necessary to start documenting its expected
behaviour and the interfaces that is uses.

# The abstract Focus class (this.state.focus of the RealmBrowserContainer)

An instance `this.state.focus` of the abstract `Focus` class is the part of the browsers state that represents the
subset of the data from a Realm on which the user wants to focus on.

The this.state.focus changes when the user is browsing around in the Realm.

A couple of specialization of Focus exists:
  - `ClassFocus`: The table shows objects that has a specific type from the schema.
    - Requires the name of the class to focus on.
      - From this we can derive the list of properties to use in the header.
  - `ListFocus`: The table shows objects from a list on another object.
    - Requires the parent object on which the list exists.
    - Requires the ObjectSchemaProperty representing the list property
      - From the parent object we can derive the ObjectSchema, which can be used to derive the ObjectSchemaProperty for
        the list that the browser is focussed on.
      - A special case exists where the ObjectSchemaProperty’s type is a primitive and not another class from the
        schema: In this case the table should show render the elements of the list instead of trying to find the class
        in the schema and derive the properties from that.

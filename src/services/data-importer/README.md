This is a CSV importer implementation base on https://github.com/realm/realm-cocoa-converter 

It hase two major features:

- [ImportSchemaGenerator](./ImportSchemaGenerator.ts): this helps create a Realm schema from the provided CSV file(s)
- [CSVDataImporter](./csv/CSVDataImporter.ts): this will actually populate the Realm file with the data contained in the CSV file(s)


# Limitations
- Similar to `realm-cocoa-converter` only optional:  `boolean`,`int`, `double` or `string` types are supported.
- Unlike the `realm-cocoa-converter` we don't scan the entire CSV file to infer the types of each property, as this is costly in terms of memory & CPU (especially for large files). This implementation will only parse the first data line (after the header) then tries to determine the appropriate types, if further down the data will not match an exception will be thrown which indicates the line, the expected type and the provided value.
- This implementation uses [papaparse](papaparse.com) to parse the CSV, however AFAIK this lib doesn't offer a streaming mode for local files which will allow us to use it to read only the header and first line of data in order to create the schema as described before.

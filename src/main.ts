import Application from "./main/application";

// Make node understand the source-maps emitted from WebPack.
if (process.env.NODE_ENV !== "production") {
  // We must require this the old fasioned way, as this is a dev dependency that might
  // not be available when the packaged application is shipped, and import statements cannot
  // be used in a block like this.
  // tslint:disable-next-line:no-var-requires
  require("source-map-support").install();
}

Application.sharedApplication.run();

const path = require('path');
const Realm = require('realm');

const getOutputPath = () => {
  if (process.argv.length >= 3) {
    return path.resolve(process.argv[2]);
  } else {
    return path.resolve(__dirname, '../all-types.realm');
  }
};

const outputPath = getOutputPath();
const allTypesSchema = require('../src/services/schema-export/tests/models/all/AllTypes');
const realm = new Realm({
  path: outputPath,
  schema: Object.values(allTypesSchema),
});
process.exit(0);

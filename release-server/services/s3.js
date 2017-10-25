const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({
  apiVersion: '2006-03-01',
  region: 'us-east-1',
});

module.exports = s3;

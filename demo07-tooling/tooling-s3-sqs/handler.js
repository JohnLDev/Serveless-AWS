'use strict';
const AWS = require('aws-sdk')
const host = process.env.LOCALSTACK_HOST || 'localhost'
const port = process.env.LOCALSTACK_PORT || '4566'
const s3config = {
  s3ForcePathStyle: true,
  endpoint: new AWS.Endpoint(`http://${host}:${port}`)
}
const S3 = new AWS.S3(s3config)
module.exports.hello = async (event) => {
console.log(`http://${host}:${port}`)

  const allBuckets = await S3.listBuckets().promise()
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        allBuckets,
        input: event,
      },
      null,
      2
    ),
  };
};

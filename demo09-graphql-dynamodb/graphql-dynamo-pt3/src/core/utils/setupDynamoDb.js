
const dynamoose = require('dynamoose')
async function setupDynamoDBClient () {
  if (!process.env.IS_LOCAL) {
    return
  }
  const host = process.env.LOCALSTACK_HOST || 'localhost'

  const port = process.env.LOCALSTACK_PORT || '4566'

  console.log('running locally', host, port)
  dynamoose.aws.sdk.config.update({
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET_ACCESS_KEY'
  })

  return dynamoose.aws.ddb.local(`http://${host}:${port}`)
}

module.exports = setupDynamoDBClient

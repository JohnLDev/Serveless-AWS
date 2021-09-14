'use strict'
const AWS = require('aws-sdk')
async function setupDynamoDB () {
  if (!process.env.IS_LOCAL) {
    return new AWS.DynamoDB.DocumentClient()
  }
  const host = process.env.LOCALSTACK_HOST || 'localhost'
  const port = process.env.LOCALSTACK_PORT || '4566'
  console.log('running locally', host, port)

  return new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET',
    endpoint: new AWS.Endpoint(`http://${host}:${port}`)
  })
}
module.exports.hello = async (event) => {
  const dynamoDB = await setupDynamoDB()
  console.log(process.env.HEROES_TABLE)
  const heroes = await dynamoDB.scan({
    TableName: process.env.HEROES_TABLE

  }).promise()

  const skills = await dynamoDB.scan({
    TableName: process.env.SKILLS_TABLE
  }).promise()
  console.log(heroes, skills)
  return {
    statusCode: 200,
    body: JSON.stringify({ heroes, skills })
  }
}

'use strict'
const settings = require('./config/settings')
const axios = require('axios')
const AWS = require('aws-sdk')
const cheerio = require('cheerio')
const uuid = require('uuid')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

class Handler {
  static async main (event) {
    console.log('at', new Date().toISOString(), JSON.stringify(event, null, 2))
    const { data } = await axios.get(settings.APICommitMessagesURL)
    const $ = cheerio.load(data)
    const [commitMessage] = await $('#content').text().trim().split('\n')

    const params = {
      TableName: settings.DbTableName,
      Item: {
        id: uuid.v1(),
        commitMessage,
        createdAt: new Date().toISOString()
      }
    }
    await dynamoDB.put(params).promise()
    console.log('process fineshed at', new Date().toISOString())
    return {
      statusCode: 200,
      body: 'oi'
    }
  }
}

// factory

module.exports = {
  scheduler: Handler.main
}

const uuid = require('uuid')
const Joi = require('@hapi/joi')
const decoratorValidator = require('./utils/decoratorValidator')
const globalEnum = require('./utils/globalEnum')

class Handler {
  constructor ({ dynamoDbSVC }) {
    this.dynamoDbSVC = dynamoDbSVC
    this.dynamoTable = process.env.DYNAMO_TABLE
  }

  static validator () {
    return Joi.object({
      nome: Joi.string().max(100).min(2).required(),
      poder: Joi.string().max(20).min(2).required()
    })
  }

  async inserItem (params) {
    return this.dynamoDbSVC.put(params).promise()
  }

  prepareData (data) {
    const params = {
      TableName: this.dynamoTable,
      Item: {
        ...data,
        id: uuid.v1(),
        createdAt: new Date().toISOString()
      }
    }
    return params
  }

  handlerSuccess (data) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    }
    return response
  }

  handlerError (data) {
    const response = {
      statusCode: data.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create item!!'
    }
    return response
  }

  async main (event) {
    try {
      // agora decorator modifica o body
      // retorna no formato JSON
      const data = event.body
      const dbParams = this.prepareData(data)

      await this.inserItem(dbParams)

      return this.handlerSuccess(dbParams.Item)
    } catch (error) {
      console.log('ERROR&&&', error.stack)
      return this.handlerError({ statusCode: 500 })
    }
  }
}

// factory
const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const handler = new Handler({
  dynamoDbSVC: dynamoDB
})
module.exports = decoratorValidator(handler.main.bind(handler), Handler.validator(), globalEnum.ARG_TYPE.BODY)

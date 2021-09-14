'use strict'
// const AWS = require('aws-sdk')
// async function setupDynamoDB () {
//   if (!process.env.IS_LOCAL) {
//     return new AWS.DynamoDB.DocumentClient()
//   }
//   const host = process.env.LOCALSTACK_HOST || 'localhost'
//   const port = process.env.LOCALSTACK_PORT || '4566'
//   console.log('running locally', host, port)

//   return new AWS.DynamoDB.DocumentClient({
//     region: 'localhost',
//     accessKeyId: 'DEFAULT_ACCESS_KEY',
//     secretAccessKey: 'DEFAULT_SECRET',
//     endpoint: new AWS.Endpoint(`http://${host}:${port}`)
//   })
// }
const { ApolloServer, gql } = require('apollo-server-lambda')

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

exports.graphqlHandler = server.createHandler()

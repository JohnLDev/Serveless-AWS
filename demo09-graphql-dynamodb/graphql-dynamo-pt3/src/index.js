'use strict'
const { ApolloServer } = require('apollo-server-lambda')
const setupDynamoDBClient = require('./core/utils/setupDynamoDb')
setupDynamoDBClient()

const HeroFactory = require('./core/factories/heroFactory')
const SkillFactory = require('./core/factories/skillFactory')
const schema = require('./graphql')
const isLocal = process.env.IS_LOCAL

const server = new ApolloServer({
  schema,
  introspection: isLocal,
  context: async () => ({
    Hero: await HeroFactory.createInstance(),
    Skill: await SkillFactory.createInstance()
  }),
  formatError: (error) => {
    console.log('[Global error logger]', error)
    return error
  },
  formatResponse: (response) => {
    console.log('[Global logger]', response)
    return response
  }
})

exports.graphqlHandler = server.createHandler()

async function main () {
  console.log('creating factories')
  const skillFactory = await SkillFactory.createInstance()
  const heroFactory = await HeroFactory.createInstance()
  console.log('inserting skill item')
  const skillId = `${Date.now()}`
  await skillFactory.create({
    id: skillId,
    name: 'mage',
    value: 1000
  })
  console.log('getting skill item')
  const skillItem = await skillFactory.findOne(skillId)

  console.log('skillItem', skillItem.toJSON())

  const allSkills = await skillFactory.findAll()
  console.log('allSkills', allSkills)

  console.log('-----------------')

  console.log('inserting hero item')
  const heroId = `${new Date().getTime()}`
  await heroFactory.create({
    id: heroId,
    name: 'Batman',
    skills: [skillId]
  })
  console.log('getting hero item')
  const heroItem = await heroFactory.findOne(heroId)
  console.log('heroItem', heroItem)

  const allheros = await heroFactory.findAll()
  console.log('allheros', allheros)

  return {
    statusCode: 200,
    body: JSON.stringify({
      hero: {
        heroItem,
        allheros
      },
      skill: {
        skillItem,
        allSkills
      }
    })
  }
}
module.exports.test = main

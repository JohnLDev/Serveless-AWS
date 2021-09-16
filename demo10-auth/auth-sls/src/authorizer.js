const jwt = require('jsonwebtoken')
const { buildIAMPolicy } = require('../lib/util')
const JWT_SECRET = process.env.JWT_SECRET || 'huasdiuashdiuh'
const myRoles = {
  'heroes:list': 'private'
}
const authorizeUser = (userScopes, methodArn) => {
  return userScopes.find(
    scope => ~methodArn.indexOf(myRoles[scope])
  )
}
exports.handler = async (event) => {
  const token = event.authorizationToken
  try {
    const decodedUser = await jwt.verify(token, JWT_SECRET)
    const userId = decodedUser.user.username
    const isAllowed = authorizeUser(decodedUser.user.scopes, event.methodArn)
    // dado que vai nas request
    const authorizationContext = {
      user: JSON.stringify(decodedUser)
    }
    const policyDocument = buildIAMPolicy(userId, isAllowed ? 'Allow' : 'Deny', event.methodArn, authorizationContext)

    return policyDocument
  } catch (error) {
    console.log('auth error ***', error.stack)
    return {
      statusCode: 401,
      body: 'Unauthorized'
    }
  }
}

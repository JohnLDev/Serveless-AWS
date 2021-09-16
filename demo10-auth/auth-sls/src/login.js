const users = require('../db/users.json')
const { sign } = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'huasdiuashdiuh'

const login = async (event) => {
  console.log('Login Invoked', new Date().toISOString(), event.body)
  const { username, password } = JSON.parse(event.body)
  // DO VALIDATION
  const ValidUser = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password)
  if (!ValidUser) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Invalid username or password'
      })
    }
  }
  const signUser = {
    scopes: ValidUser.scopes,
    username: ValidUser.username
  }
  const token = sign({
    user: signUser
  }, JWT_SECRET, { expiresIn: '5m' })

  return {
    statusCode: 200,
    body: JSON.stringify({ token })
  }
}
exports.handler = login

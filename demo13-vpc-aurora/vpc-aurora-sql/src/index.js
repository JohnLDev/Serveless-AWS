const {HeroiSchema, sequelize} = require('./database')
const handler =  async (event) => {
  try {
    await sequelize.authenticate()
    console.log('Connection established!')
    return {
      statusCode:200,
      body:'deu bom'
    }
  } catch (error) {
    console.log('Connection not established!', error.stack);
    return {
      statusCode:500,
      body:'deu ruim'
    }
  }
}

exports.handler = handler
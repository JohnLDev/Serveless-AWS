const Sequelize = require('sequelize')
const connection = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}
console.log(connection)

const sequelize = new Sequelize(
  connection.database, 
  connection.user, 
  connection.password, 
  { 
    host: connection.host,
    dialect:'mysql',
    //case sensitive

  },
  )

  const Herois = sequelize.define('herois',{
    id:{
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name:{
      type: Sequelize.STRING,
      required: true,
    },
    poder:{
      type: Sequelize.STRING,
      required: true,
    }
  },{
    tableName:'TB_HEROIS',
    freezeTableName: false,
    timestamp: false
  })

  module.exports = {
    HeroiSchema: Herois,
    sequelize,
  }
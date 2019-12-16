const Sequelize = require('sequelize');

module.exports = {
  server: {
    host: '0.0.0.0',
    port: 3030
  },
  swaggerHost: 'localhost',
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      multipleStatements: true
    },
    logging:false,
    storage: './db/localDB.db',
    operatorsAliases: Sequelize.Op
  }
}
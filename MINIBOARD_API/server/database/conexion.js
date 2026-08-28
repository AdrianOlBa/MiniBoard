const { Sequelize } = require('sequelize');
const initializeModels = require('../../database/models/init-models.js');
//conexion en pool con la DB
const sequelize = new Sequelize('MINIBOARD', 'Adrian', 'contrasenya', {
  dialect: 'postgres',
  host: 'database',
  port: 5432,
  pool: {
    max: 10,
    min: 0
  }
})

//inicializar modelos
let models = initializeModels(sequelize);

module.exports = { sequelize , models };
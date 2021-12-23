
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

(async function () {
  try {
    await sequelize.authenticate();
    console.log('DATABASE CONNECTED');
  } catch (err) {
    console.error('DATABASE NOT CONNECTED')
  }
})();

module.exports = sequelize;


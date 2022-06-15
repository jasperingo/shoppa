
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: function(msg) {
    if (process.env.NODE_ENV === 'development') {
      console.log(msg);
    }
  }
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


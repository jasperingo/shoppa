
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Customer = require("./Customer");

class CustomerHistory extends Model {}

CustomerHistory.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'customers_history',
  modelName: 'customer_history',
});

const foreignKey = {
  name: 'customer_id',
  type: DataTypes.BIGINT
};

Customer.hasMany(CustomerHistory, {
  foreignKey
});

CustomerHistory.belongsTo(Customer, {
  foreignKey
});

module.exports = CustomerHistory;

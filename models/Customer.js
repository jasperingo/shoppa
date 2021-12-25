
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class Customer extends Model {

  hidePassword() {
    this.password = undefined;
  }

}

Customer.init({

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

  href: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${process.env.API_PATH}customer/${this.id}`;
    }
  },
},
{
  sequelize,
  timestamps: false,
  tableName: 'customers',
  modelName: 'customer',
});

const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasOne(Customer, {
  foreignKey
});

Customer.belongsTo(User, {
  foreignKey
});

module.exports = Customer;

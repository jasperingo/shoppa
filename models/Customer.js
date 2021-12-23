
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class Customer extends Model {}

Customer.init({

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
  hooks: {
    afterFind: (record)=> {
      if (record) {
        record.dataValues = {
          ...record.dataValues,
          ...(record.dataValues.user ? record.dataValues.user.dataValues : {}),
          photo: (record.dataValues.user ? record.dataValues.user.photo : {}),
          user: undefined
        }
      }
    }
  }
});

const foreignKey = {
  name: 'id',
  type: DataTypes.BIGINT,
  primaryKey: true
};

User.hasOne(Customer, {
  foreignKey
});

Customer.belongsTo(User, {
  foreignKey
});

module.exports = Customer;

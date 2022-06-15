
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Address = require("./Address");

class AddressHistory extends Model {}

AddressHistory.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING
  },

  street: {
    type: DataTypes.STRING,
    allowNull: false
  },

  city: {
    type: DataTypes.STRING,
    allowNull: false
  },

  state: {
    type: DataTypes.STRING,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM(Address.TYPE_DEFAULT, Address.TYPE_SUB, Address.TYPE_PICK_UP),
    allowNull: false
  },
  
  created_at: {
    type: DataTypes.DATE
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'addresses_history',
  modelName: 'address_history',
});

const foreignKey = {
  name: 'address_id',
  type: DataTypes.BIGINT
};

Address.hasMany(AddressHistory, {
  foreignKey
});

AddressHistory.belongsTo(Address, {
  foreignKey
});

module.exports = AddressHistory;

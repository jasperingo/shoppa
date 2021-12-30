
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class Address extends Model {

  static TYPE_DEFAULT = 'default';

  static TYPE_SUB = 'sub';

  static TYPE_PICK_UP = 'pick_up';


  static GET_ATTR = ['id', 'street', 'city', 'state'];

}

Address.init({

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

  href: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${process.env.API_PATH}address/${this.id}`;
    }
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'addresses',
  modelName: 'address',
});

const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasMany(Address, {
  foreignKey
});

Address.belongsTo(User, {
  foreignKey
});

module.exports = Address;




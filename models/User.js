
const { get } = require("express/lib/response");
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');

class User extends Model {

  static TYPE_CUSTOMER = 'customer';

  static TYPE_STORE = 'store';

  static TYPE_DELIVERY_FIRM = 'delivery_firm';

  static STATUS_ACTIVE = 'active';

  static STATUS_SUSPENDED = 'suspended';

  static STATUS_DEACTIVATED = 'deactivated';

}

User.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  type: {
    type: DataTypes.ENUM(User.TYPE_CUSTOMER, User.TYPE_STORE, User.TYPE_DELIVERY_FIRM),
    allowNull: false
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false
  },

  phone_number: {
    type: DataTypes.STRING
  },

  photo: {
    type: DataTypes.STRING,
    get() {
      const photoName = this.getDataValue('photo');
      return {
        name: photoName,
        href: `photos/${photoName ? photoName : 'default.jpg'}`
      };
    }
  },

  status: {
    type: DataTypes.ENUM(User.STATUS_ACTIVE, User.STATUS_SUSPENDED, User.STATUS_DEACTIVATED),
    allowNull: false,
    defaultValue: User.STATUS_ACTIVE
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'users',
  modelName: 'user'
});

module.exports = User;

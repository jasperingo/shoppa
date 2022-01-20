
const { Model, DataTypes } = require("sequelize");
const Files = require("../http/Files");
const sequelize = require('../repository/DB');

class User extends Model {

  static TYPE_CUSTOMER = 'customer';

  static TYPE_STORE = 'store';

  static TYPE_DELIVERY_FIRM = 'delivery_firm';
  
  
  static STATUS_ACTIVE = 'active';

  static STATUS_ACTIVATING = 'activating';

  static STATUS_DEACTIVATED = 'deactivated';


  static GET_ATTR = ['id', 'name', 'email', 'phone_number', 'photo', 'status', 'type', 'updated_at'];

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
    type: DataTypes.STRING,
    allowNull: false
  },

  photo: {
    type: DataTypes.STRING,
    get() {
      const photoName = this.getDataValue('photo');
      const type = this.getDataValue('type');
      return {
        name: photoName,
        href: Files.getUserPhotoPath(photoName, type)
      };
    }
  },

  status: {
    type: DataTypes.ENUM(User.STATUS_ACTIVE, User.STATUS_ACTIVATING, User.STATUS_DEACTIVATED),
    allowNull: false
  },

  updated_at: {
    type: DataTypes.DATE
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at',
  tableName: 'users',
  modelName: 'user'
});

module.exports = User;

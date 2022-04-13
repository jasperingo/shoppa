
const { Model, DataTypes } = require("sequelize");
const Files = require("../http/Files");
const sequelize = require('../repository/DB');

class User extends Model {

  static TYPE_APPLICATION = 'application';

  static TYPE_CUSTOMER = 'customer';

  static TYPE_STORE = 'store';

  static TYPE_DELIVERY_FIRM = 'delivery_firm';
  
  
  static STATUS_PENDING = 'pending';

  static STATUS_EMAIL_PENDING = 'email_pending';

  static STATUS_ACTIVE = 'active';

  static STATUS_ACTIVATING = 'activating';

  static STATUS_DEACTIVATED = 'deactivated';


  static GET_ATTR = ['id', 'name', 'email', 'phone_number', 'photo', 'status', 'type', 'updated_at'];


  static getTypes() {
    return [
      User.TYPE_APPLICATION,
      User.TYPE_CUSTOMER,
      User.TYPE_STORE,
      User.TYPE_DELIVERY_FIRM
    ]
  }

  static getStatuses() {
    return [
      User.STATUS_PENDING,
      User.STATUS_EMAIL_PENDING,
      User.STATUS_ACTIVE,
      User.STATUS_ACTIVATING,
      User.STATUS_DEACTIVATED
    ];
  }

}

User.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  type: {
    type: DataTypes.ENUM(...User.getTypes()),
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
    type: DataTypes.ENUM(...User.getStatuses()),
    allowNull: false
  },

  email_verified: {
    type: DataTypes.BOOLEAN
  },

  email_verification_token: {
    type: DataTypes.STRING
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


const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class UserHistory extends Model {}

UserHistory.init({

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
    type: DataTypes.STRING
  },

  status: {
    type: DataTypes.ENUM(User.STATUS_ACTIVE, User.STATUS_ACTIVATING, User.STATUS_DEACTIVATED),
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'users_history',
  modelName: 'user_history'
});

const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasMany(UserHistory, {
  foreignKey
});

UserHistory.belongsTo(User, {
  foreignKey
});

module.exports = UserHistory;

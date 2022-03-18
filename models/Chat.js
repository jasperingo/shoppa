
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class Chat extends Model {}

Chat.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  last_message_id: {
    type: DataTypes.BIGINT
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'chats',
  modelName: 'chat'
});

User.hasMany(Chat, { 
  as: 'member_one', 
  foreignKey: { name: 'member_one_id', type: DataTypes.BIGINT, allowNull: false } 
});

User.hasMany(Chat, { 
  as: 'member_two', 
  foreignKey: { name: 'member_two_id', type: DataTypes.BIGINT, allowNull: false } 
});

Chat.belongsTo(User, { 
  as: 'member_one', 
  foreignKey: { name: 'member_one_id', type: DataTypes.BIGINT, allowNull: false } 
});

Chat.belongsTo(User, { 
  as: 'member_two', 
  foreignKey: { name: 'member_two_id', type: DataTypes.BIGINT, allowNull: false } 
});

module.exports = Chat;

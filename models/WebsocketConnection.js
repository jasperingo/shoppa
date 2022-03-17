
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class WebsocketConnection extends Model {}

WebsocketConnection.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  socket_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  createdAt: false,
  tableName: 'websocket_connections',
  modelName: 'websocket_connection'
});

const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasMany(WebsocketConnection, { foreignKey });

WebsocketConnection.belongsTo(User, { foreignKey });

module.exports = WebsocketConnection;

const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Route = require("./Route");

class RouteHistory extends Model {}

RouteHistory.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  origin_route_id: {
    type: DataTypes.BIGINT
  },

  destination_route_id: {
    type: DataTypes.BIGINT
  },

  state: {
    type: DataTypes.STRING
  },

  city: {
    type: DataTypes.STRING
  },

  door_delivery: {
    type: DataTypes.BOOLEAN
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'delivery_routes_history',
  modelName: 'delivery_route_history'
});

const foreignKey = {
  name: 'delivery_route_id',
  type: DataTypes.BIGINT
};

Route.hasMany(RouteHistory, { foreignKey });

RouteHistory.belongsTo(Route, { foreignKey });


module.exports = RouteHistory;


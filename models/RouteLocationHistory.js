const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const RouteLocation = require("./RouteLocation");

class RouteLocationHistory extends Model {}

RouteLocationHistory.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  city: {
    type: DataTypes.STRING,
    allowNull: false
  },

  state: {
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
  tableName: 'delivery_route_locations_history',
  modelName: 'delivery_route_location_history'
});


const foreignKey = {
  name: 'delivery_route_location_id',
  type: DataTypes.BIGINT
};

RouteLocation.hasMany(RouteLocationHistory, { foreignKey });

RouteLocationHistory.belongsTo(RouteLocation, { foreignKey });


module.exports = RouteLocationHistory;

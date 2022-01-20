const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const RouteWeight = require("./RouteWeight");

class RouteWeightHistory extends Model {}

RouteWeightHistory.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  minimium: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  maximium: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  fee: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'delivery_route_weights_history',
  modelName: 'delivery_route_weight_history'
});

const foreignKey = {
  name: 'delivery_route_weight_id',
  type: DataTypes.BIGINT
};

RouteWeight.hasMany(RouteWeightHistory, { foreignKey });

RouteWeightHistory.belongsTo(RouteWeight, { foreignKey });


module.exports = RouteWeightHistory;

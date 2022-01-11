const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Route = require("./Route");

class RouteWeight extends Model {}

RouteWeight.init({

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

  deleted_at: {
    type: DataTypes.DATE
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'delivery_route_weights',
  modelName: 'delivery_route_weight'
});

const foreignKey = {
  name: 'delivery_route_id',
  type: DataTypes.BIGINT
};

Route.hasMany(RouteWeight, { foreignKey });

RouteWeight.belongsTo(Route, { foreignKey });


module.exports = RouteWeight;

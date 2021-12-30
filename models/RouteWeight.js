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

  price: {
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
  tableName: 'route_weights',
  modelName: 'route_weight'
});

const foreignKey = {
  name: 'route_id',
  type: DataTypes.BIGINT
};

Route.hasMany(RouteWeight, { foreignKey });

RouteWeight.belongsTo(Route, { foreignKey });


module.exports = RouteWeight;

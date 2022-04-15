const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Route = require("./Route");

class RouteLocation extends Model {}

RouteLocation.init({

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

  updated_at: {
    type: DataTypes.DATE
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
  timestamps: true,
  createdAt: false,
  paranoid: true,
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  tableName: 'delivery_route_locations',
  modelName: 'delivery_route_location'
});


const foreignKey = {
  name: 'delivery_route_id',
  type: DataTypes.BIGINT
};

Route.hasMany(RouteLocation, { foreignKey });

RouteLocation.belongsTo(Route, { foreignKey });


module.exports = RouteLocation;

const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const DeliveryFirm = require("./DeliveryFirm");

class Route extends Model {}

Route.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
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
  tableName: 'delivery_routes',
  modelName: 'delivery_route'
});

const foreignKey = {
  name: 'delivery_firm_id',
  type: DataTypes.BIGINT
};

DeliveryFirm.hasMany(Route, { foreignKey });

Route.belongsTo(DeliveryFirm, { foreignKey });


Route.belongsTo(Route, { as: 'origin_route', foreignKey: {
  name: 'origin_route_id',
  type: DataTypes.BIGINT
}});


Route.belongsTo(Route, { as: 'destination_route', foreignKey: {
  name: 'destination_route_id',
  type: DataTypes.BIGINT
}});

module.exports = Route;


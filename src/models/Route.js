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

  name: {
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


module.exports = Route;

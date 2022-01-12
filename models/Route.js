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
    type: DataTypes.STRING,
    allowNull: false
  },

  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  isolated: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },

  door_delivery: {
    type: DataTypes.BOOLEAN,
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


const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const DeliveryFirm = require("./DeliveryFirm");

class Route extends Model {}

Route.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  location_1_state: {
    type: DataTypes.STRING,
    allowNull: false
  },

  location_2_state: {
    type: DataTypes.STRING,
    allowNull: false
  },

  location_1_city: {
    type: DataTypes.STRING
  },

  location_2_city: {
    type: DataTypes.STRING
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
  tableName: 'routes',
  modelName: 'route'
});

const foreignKey = {
  name: 'delivery_firm_id',
  type: DataTypes.BIGINT
};

DeliveryFirm.hasMany(Route, { foreignKey });

Route.belongsTo(DeliveryFirm, { foreignKey });


module.exports = Route;


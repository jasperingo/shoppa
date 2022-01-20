const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const RouteDuration = require("./RouteDuration");


class RouteDurationHistory extends Model {}

RouteDurationHistory.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  minimium: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  maximium: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  fee: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  unit: {
    type: DataTypes.ENUM(...RouteDuration.getUnits()),
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'delivery_route_durations_history',
  modelName: 'delivery_route_duration_history'
});


const foreignKey = {
  name: 'delivery_route_duration_id',
  type: DataTypes.BIGINT
};

RouteDuration.hasMany(RouteDurationHistory, { foreignKey });

RouteDurationHistory.belongsTo(RouteDuration, { foreignKey });


module.exports = RouteDurationHistory;

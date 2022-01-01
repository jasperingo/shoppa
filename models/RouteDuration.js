const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Route = require("./Route");


class RouteDuration extends Model {

  static UNIT_MINUTE = 'minute';
  
  static UNIT_HOUR = 'hour';

  static UNIT_DAY = 'day';

  static UNIT_WEEK = 'week';

  static UNIT_MONTH = 'month';


  static getUnits() {
    return [
      RouteDuration.UNIT_MINUTE, 
      RouteDuration.UNIT_HOUR, 
      RouteDuration.UNIT_DAY, 
      RouteDuration.UNIT_WEEK, 
      RouteDuration.UNIT_MONTH
    ];
  }

}

RouteDuration.init({

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
    type: DataTypes.ENUM(
      RouteDuration.UNIT_MINUTE,
      RouteDuration.UNIT_HOUR,
      RouteDuration.UNIT_DAY,
      RouteDuration.UNIT_WEEK,
      RouteDuration.UNIT_MONTH
    ),
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
  tableName: 'route_durations',
  modelName: 'route_duration'
});


const foreignKey = {
  name: 'route_id',
  type: DataTypes.BIGINT
};

Route.hasMany(RouteDuration, { foreignKey });

RouteDuration.belongsTo(Route, { foreignKey });


module.exports = RouteDuration;

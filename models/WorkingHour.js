
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class WorkingHour extends Model {

  static DAY_SUNDAY = 'sunday';

  static DAY_MONDAY = 'monday';

  static DAY_TUESDAY = 'tuesday';

  static DAY_WEDNESDAY = 'wednesday';

  static DAY_THURSDAY = 'thursday';

  static DAY_FRIDAY = 'friday';

  static DAY_SATURDAY = 'saturday';


  static GET_ATTR = ['id', 'day', 'opening', 'closing'];

  static getDays() {
    return [
      WorkingHour.DAY_SUNDAY, 
      WorkingHour.DAY_MONDAY, 
      WorkingHour.DAY_TUESDAY, 
      WorkingHour.DAY_WEDNESDAY, 
      WorkingHour.DAY_THURSDAY,
      WorkingHour.DAY_FRIDAY,
      WorkingHour.DAY_SATURDAY
    ];
  }

}

WorkingHour.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  day: {
    type: DataTypes.ENUM(
      WorkingHour.DAY_SUNDAY, 
      WorkingHour.DAY_MONDAY, 
      WorkingHour.DAY_TUESDAY, 
      WorkingHour.DAY_WEDNESDAY, 
      WorkingHour.DAY_THURSDAY,
      WorkingHour.DAY_FRIDAY,
      WorkingHour.DAY_SATURDAY
    ),
    allowNull: false
  },

  opening: {
    type: DataTypes.TIME,
    allowNull: false
  },

  closing: {
    type: DataTypes.TIME,
    allowNull: false
  },
  
  created_at: {
    type: DataTypes.DATE
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'working_hours',
  modelName: 'working_hour',
});

const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasMany(WorkingHour, {
  foreignKey
});

WorkingHour.belongsTo(User, {
  foreignKey
});

module.exports = WorkingHour;




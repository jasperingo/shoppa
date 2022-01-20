const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Store = require("./Store");

class StoreHistory extends Model {}

StoreHistory.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  sub_category_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'stores_history',
  modelName: 'store_history'
});

const foreignKey = {
  name: 'store_id',
  type: DataTypes.BIGINT
};

Store.hasMany(StoreHistory, { foreignKey });

StoreHistory.belongsTo(Store, { foreignKey });


module.exports = StoreHistory;

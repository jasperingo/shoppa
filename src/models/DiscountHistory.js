const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Discount = require("./Discount");

class DiscountHistory extends Model {}

DiscountHistory.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM(...Discount.getTypes()),
    allowNull: false
  },

  value: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  minimium_required_amount: {
    type: DataTypes.DOUBLE
  },

  minimium_required_quantity: {
    type: DataTypes.DOUBLE
  },

  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },

  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'discounts_history',
  modelName: 'discount_history'
});


const foreignKey = {
  name: 'discount_id',
  type: DataTypes.BIGINT
};

Discount.hasMany(DiscountHistory, { foreignKey });

DiscountHistory.belongsTo(Discount, { foreignKey });


module.exports = DiscountHistory;

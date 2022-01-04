const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Store = require("./Store");

class Discount extends Model {

  static TYPE_PERCENTAGE = 'percentage';

  static TYPE_AMOUNT = 'amount';

  static getTypes() {
    return [
      Discount.TYPE_PERCENTAGE,
      Discount.TYPE_AMOUNT
    ]
  }

}

Discount.init({

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
    type: DataTypes.ENUM(Discount.TYPE_PERCENTAGE, Discount.TYPE_AMOUNT),
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
  tableName: 'discounts',
  modelName: 'discount'
});


const foreignKey = {
  name: 'store_id',
  type: DataTypes.BIGINT
};

Store.hasMany(Discount, { foreignKey });

Discount.belongsTo(Store, { foreignKey });


module.exports = Discount;

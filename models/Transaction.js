const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Order = require("./Order");
const User = require("./User");

class Transaction extends Model {

  static STORE_CHARGE = 10;
  static DELIVERY_FIRM_CHARGE = 5;

  static REFERENCE_PREFIX = 'DNTX_';

  static STATUS_APPROVED = 'approved';
  static STATUS_PENDING = 'pending';
  static STATUS_FAILED = 'failed';
  static STATUS_CANCELLED = 'cancelled';
  static STATUS_DECLINED =  'declined';
  static STATUS_PROCESSING =  'processing';

  static TYPE_PAYMENT = 'payment';
  static TYPE_WITHDRAWAL = 'withdrawal';
  static TYPE_DEPOSIT = 'deposit';
  static TYPE_REFUND = 'refund';
  static TYPE_INCOME = 'income';
  static TYPE_CHARGE = 'charge';

  static getStatuses() {
    return [
      Transaction.STATUS_APPROVED,
      Transaction.STATUS_PENDING,
      Transaction.STATUS_FAILED,
      Transaction.STATUS_CANCELLED,
      Transaction.STATUS_DECLINED,
      Transaction.STATUS_PROCESSING
    ];
  }

  static getTypes() {
    return [
      Transaction.TYPE_PAYMENT,
      Transaction.TYPE_WITHDRAWAL,
      Transaction.TYPE_DEPOSIT,
      Transaction.TYPE_REFUND,
      Transaction.TYPE_INCOME,
      Transaction.TYPE_CHARGE
    ];
  }

  static getStoreCharge(amount) {
    return ((Transaction.STORE_CHARGE / 100) * amount).toFixed(2);
  }

  static getDeliveryFirmCharge(amount) {
    return ((Transaction.DELIVERY_FIRM_CHARGE / 100) * amount).toFixed(2);
  }

}

Transaction.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  application: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },

  reference: {
    type: DataTypes.STRING,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(...Transaction.getStatuses()),
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM(...Transaction.getTypes()),
    allowNull: false
  },

  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'transactions',
  modelName: 'transaction'
});

const uForeignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasMany(Transaction, { foreignKey: uForeignKey });

Transaction.belongsTo(User, { foreignKey: uForeignKey });


const oForeignKey = {
  name: 'order_id',
  type: DataTypes.BIGINT
};

Order.hasMany(Transaction, { foreignKey: oForeignKey });

Transaction.belongsTo(Order, { foreignKey: oForeignKey });


module.exports = Transaction;

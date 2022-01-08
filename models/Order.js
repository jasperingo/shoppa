
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Address = require("./Address");
const Customer = require("./Customer");
const DeliveryFirm = require("./DeliveryFirm");
const Route = require("./Route");
const Store = require("./Store");

class Order extends Model {

  static STATUS_PENDING = 'pending';
  static STATUS_PROCESSING = 'processing';
  static STATUS_DECLINED = 'declined';
  static STATUS_CANCELLED = 'cancelled';
  static STATUS_FULFILLED = 'fulfilled';

  static STORE_STATUS_PENDING = 'pending';
  static STORE_STATUS_ACCEPTED = 'accepted';
  static STORE_STATUS_DECLINED = 'declined';

  static DELIVERY_FIRM_STATUS_PENDING = 'pending';
  static DELIVERY_FIRM_STATUS_ACCEPTED = 'accepted';
  static DELIVERY_FIRM_STATUS_DECLINED = 'declined';

  static DELIVERY_METHOD_DOOR = 'door';
  static DELIVERY_METHOD_STORE = 'store';

  static PAYMENT_METHOD_CASHLESS = 'cashless';
  static PAYMENT_METHOD_CASH = 'cash';

  static PAYMENT_STATUS_PENDING = 'pending';
  static PAYMENT_STATUS_APPROVED = 'approved';


  static getStatuses() {
    return [
      Order.STATUS_PENDING,
      Order.STATUS_PROCESSING,
      Order.STATUS_DECLINED,
      Order.STATUS_CANCELLED,
      Order.STATUS_FULFILLED
    ];
  }
  
  static getStoreStatuses() {
    return [
      Order.STORE_STATUS_PENDING,
      Order.STORE_STATUS_ACCEPTED,
      Order.STORE_STATUS_DECLINED
    ];
  }

  static getDeliveryFirmStatuses() {
    return [
      Order.DELIVERY_FIRM_STATUS_PENDING,
      Order.DELIVERY_FIRM_STATUS_ACCEPTED,
      Order.DELIVERY_FIRM_STATUS_DECLINED
    ];
  }

  static getDeliveryMethods() {
    return [
      Order.DELIVERY_METHOD_DOOR,
      Order.DELIVERY_METHOD_STORE
    ];
  }

  static getPaymentMethods() {
    return [
      Order.PAYMENT_METHOD_CASHLESS,
      Order.PAYMENT_METHOD_CASH
    ];
  }

  static getPaymentStatuses() {
    return [
      Order.PAYMENT_STATUS_PENDING,
      Order.PAYMENT_STATUS_APPROVED
    ];
  }

}

Order.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  number: {
    type: DataTypes.STRING,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(...Order.getStatuses()),
    allowNull: false
  },

  store_status: {
    type: DataTypes.ENUM(...Order.getStoreStatuses()),
    allowNull: false
  },

  delivery_firm_status: {
    type: DataTypes.ENUM(...Order.getDeliveryFirmStatuses())
  },

  delivery_method: {
    type: DataTypes.ENUM(...Order.getDeliveryMethods()),
    allowNull: false
  },

  payment_method: {
    type: DataTypes.ENUM(...Order.getPaymentMethods()),
    allowNull: false
  },

  payment_status: {
    type: DataTypes.ENUM(...Order.getPaymentStatuses()),
    allowNull: false
  },
  
  note: {
    type: DataTypes.STRING
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'orders',
  modelName: 'order'
});


const cForeignKey = {
  name: 'customer_id',
  type: DataTypes.BIGINT
};

Customer.hasMany(Order, { foreignKey: cForeignKey });

Order.belongsTo(Customer, { foreignKey: cForeignKey });


const sForeignKey = {
  name: 'store_id',
  type: DataTypes.BIGINT
};

Store.hasMany(Order, { foreignKey: sForeignKey });
 
Order.belongsTo(Store, { foreignKey: sForeignKey });


const dForeignKey = {
  name: 'delivery_firm_id',
  type: DataTypes.BIGINT
};

DeliveryFirm.hasMany(Order, { foreignKey: dForeignKey });

Order.belongsTo(DeliveryFirm, { foreignKey: dForeignKey });


const rForeignKey = {
  name: 'route_id',
  type: DataTypes.BIGINT
};

Route.hasMany(Order, { foreignKey: rForeignKey });

Order.belongsTo(Route, { foreignKey: rForeignKey });


const aForeignKey = {
  name: 'customer_address_id',
  type: DataTypes.BIGINT
};

Address.hasMany(Order, { foreignKey: aForeignKey });

Order.belongsTo(Address, { foreignKey: aForeignKey });


module.exports = Order;


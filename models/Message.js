const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Transaction = require("./Transaction");
const User = require("./User");

class Message extends Model {

  static APPLICATION_ROLE_RECEIVER = 'receiver';
  static APPLICATION_ROLE_SENDER = 'sender';


  static DELIVERY_STATUS_SENT = 'sent';
  static DELIVERY_STATUS_DELIVERED = 'delivered';


  static NOTIFICATION_ORDER_CREATED = 'order_created';
  static NOTIFICATION_ORDER_ACCEPTED = 'order_accepted';
  static NOTIFICATION_ORDER_DECLINED = 'order_declined';
  static NOTIFICATION_ORDER_CANCELLED = 'order_cancelled';
  static NOTIFICATION_TRANSACTION_CREATED = 'transaction_created';
  static NOTIFICATION_TRANSACTION_CANCELLED = 'transaction_cancelled';
  static NOTIFICATION_TRANSACTION_DECLINED = 'transaction_declined';
  static NOTIFICATION_TRANSACTION_PROCESSING = 'transaction_processing';
  static NOTIFICATION_TRANSACTION_FAILED = 'transaction_failed';
  static NOTIFICATION_TRANSACTION_APPROVED = 'transaction_approved';
  static NOTIFICATION_ORDER_ITEM_PROCESSING = 'order_item_processing';
  static NOTIFICATION_ORDER_ITEM_TRANSPORTED = 'order_item_transported';
  static NOTIFICATION_ORDER_ITEM_DELIVERED = 'order_item_delivered';

  
  static getApplicationRoles() {
    return [
      Message.APPLICATION_ROLE_RECEIVER,
      Message.APPLICATION_ROLE_SENDER
    ];
  }

  static getDeliveryStatuses() {
    return [
      Message.DELIVERY_STATUS_SENT,
      Message.DELIVERY_STATUS_DELIVERED
    ];
  }

  static getNotifications() {
    return [
      Message.NOTIFICATION_ORDER_CREATED,
      Message.NOTIFICATION_ORDER_ACCEPTED,
      Message.NOTIFICATION_ORDER_DECLINED,
      Message.NOTIFICATION_ORDER_CANCELLED,
      Message.NOTIFICATION_TRANSACTION_CREATED,
      Message.NOTIFICATION_TRANSACTION_CANCELLED,
      Message.NOTIFICATION_TRANSACTION_DECLINED,
      Message.NOTIFICATION_TRANSACTION_PROCESSING,
      Message.NOTIFICATION_TRANSACTION_FAILED,
      Message.NOTIFICATION_TRANSACTION_APPROVED,
      Message.NOTIFICATION_ORDER_ITEM_PROCESSING,
      Message.NOTIFICATION_ORDER_ITEM_TRANSPORTED,
      Message.NOTIFICATION_ORDER_ITEM_DELIVERED
    ];
  }

}

Message.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  
  application: {
    type: DataTypes.ENUM(...Message.getApplicationRoles()),
  },

  notification: {
    type: DataTypes.ENUM(...Message.getDeliveryStatuses()),
  },

  content: {
    type: DataTypes.STRING
  },

  delivery_status: {
    type: DataTypes.ENUM(...Message.getDeliveryStatuses()),
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'messages',
  modelName: 'message'
});


User.hasMany(Message, { as: 'sender', foreignKey: { name: 'sender_id', type: DataTypes.BIGINT } });
User.hasMany(Message, { as: 'receiver', foreignKey: { name: 'receiver_id', type: DataTypes.BIGINT } });
Message.belongsTo(User);


const tForeignKey = {
  name: 'transaction_id',
  type: DataTypes.BIGINT
};
Transaction.hasMany(Message, { foreignKey: tForeignKey });
Message.belongsTo(Transaction, { foreignKey: tForeignKey });


const oForeignKey = {
  name: 'order_id',
  type: DataTypes.BIGINT
};
Order.hasMany(Message, { foreignKey: oForeignKey });
Message.belongsTo(Order, { foreignKey: oForeignKey });


const oiForeignKey = {
  name: 'order_item_id',
  type: DataTypes.BIGINT
};
OrderItem.hasMany(Message, { foreignKey: oiForeignKey });
Message.belongsTo(OrderItem, { foreignKey: oiForeignKey });



module.exports = Message;

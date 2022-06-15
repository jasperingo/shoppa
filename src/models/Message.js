const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Chat = require("./Chat");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Transaction = require("./Transaction");
const User = require("./User");

class Message extends Model {

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


const uForeignKey = { name: 'user_id', type: DataTypes.BIGINT, allowNull: false };

User.hasMany(Message, { foreignKey: uForeignKey });

Message.belongsTo(User, { foreignKey: uForeignKey });


const cForeignKey = { name: 'chat_id', type: DataTypes.BIGINT, allowNull: false };

Chat.hasMany(Message, { foreignKey: cForeignKey });

Message.belongsTo(Chat, { foreignKey: cForeignKey });


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

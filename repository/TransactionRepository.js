const { Op } = require("sequelize");
const Customer = require("../models/Customer");
const CustomerHistory = require("../models/CustomerHistory");
const DeliveryFirm = require("../models/DeliveryFirm");
const Message = require("../models/Message");
const Order = require("../models/Order");
const Store = require("../models/Store");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const UserHistory = require("../models/UserHistory");
const sequelize = require("./DB");

module.exports = {

  async referenceExists(reference) {
    const tx = await Transaction.findOne({ attributes: ['id'], where: { reference } });
    return tx !== null;
  },

  get(id) {
    return sequelize.transaction(async (transaction)=> {
      const tx = await Transaction.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: User.GET_ATTR,
            include: [
              {
                model: Customer,
                attributes: Customer.GET_ATTR
              },
              {
                model: Store,
              },
              {
                model: DeliveryFirm,
              }
            ]
          },
          {
            model: Order
          }
        ],
        transaction
      });

      if (tx !== null) {

        const txDate = (new Date(tx.created_at)).getTime();

        const userUpdatedDate = (new Date(tx.user.updated_at)).getTime();

        if (userUpdatedDate > txDate) {
          const userHistory = await UserHistory.findOne({
            where: {
              user_id: tx.user.id,
              created_at: { [Op.gt]: tx.created_at }
            },
            order: [['created_at', 'ASC']],
            transaction
          });

          tx.user.name = userHistory.name;
          tx.user.email = userHistory.email;
          tx.user.phone_number = userHistory.phone_number;
          tx.user.photo = userHistory.photo;
        }
        
        if (tx.user.customer !== null) {

          const customerUpdatedDate = (new Date(tx.user.customer.updated_at)).getTime();
  
          if (customerUpdatedDate > txDate) {
            const customerHistory = await CustomerHistory.findOne({
              where: {
                customer_id: tx.user.customer.id,
                created_at: { [Op.gt]: tx.created_at }
              },
              order: [['created_at', 'ASC']],
              transaction
            });
  
            tx.user.customer.first_name = customerHistory.first_name;
            tx.user.customer.last_name = customerHistory.last_name;
          }
        }
      }

      return tx;
    });
  },

  async getBalance(user_id) {
    const balance = await Transaction.sum('amount', { 
      where: { 
        user_id,
        status: {
          [Op.notIn]: [Transaction.STATUS_CANCELLED, Transaction.STATUS_DECLINED, Transaction.STATUS_FAILED]
        }
      } 
    });

    return balance ?? 0;
  },
  
  async getBalanceByAdministrator() {
    const balance = await Transaction.sum('amount', { 
      where: { application: true } 
    });

    return balance ?? 0;
  },

  getList(offset, limit, options) {
    return Transaction.findAndCountAll({ 
      where: options ?? undefined,
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getListByUser(user_id, offset, limit) {
    return Transaction.findAndCountAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getListByAdministrator(offset, limit) {
    return Transaction.findAndCountAll({
      where: { application: true },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },
  
  createWithdrawal({ amount }, reference, user_id) {
    return sequelize.transaction(async (transaction)=> {
      const tx = await Transaction.create(
          { 
          user_id,
          reference,
          amount: -amount,
          application: false,
          status: Transaction.STATUS_PENDING,
          type: Transaction.TYPE_WITHDRAWAL
        },
        { transaction }
      );
      
      const message = await Message.create(
        { 
          transaction_id: tx.id, 
          sender_id: tx.user_id,
          application: Message.APPLICATION_ROLE_RECEIVER,
          notification: Message.NOTIFICATION_TRANSACTION_CREATED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );

      return { transaction: tx, message };
    });
  },

  createPayment(order, reference) {
    return sequelize.transaction(async (transaction)=> {

      const tx = await Transaction.create(
        { 
          reference,
          application: false, 
          order_id: order.id, 
          amount: -order.total,
          user_id: order.customer.user.id,
          status: Transaction.STATUS_PENDING,
          type: Transaction.TYPE_PAYMENT
        }, 
        { transaction }
      );
      
      await Order.update(
        { payment_status: Order.PAYMENT_STATUS_PENDING }, 
        { where: { id: order.id }, transaction }
      );

      return tx;
    });
  },
  
  createRefund(order, reference) {
    return sequelize.transaction(async (transaction)=> {

      const tx = await Transaction.create(
        { 
          reference,
          application: false, 
          order_id: order.id, 
          amount: order.total,
          user_id: order.customer.user.id,
          status: Transaction.STATUS_PENDING,
          type: Transaction.TYPE_REFUND
        }, 
        { transaction }
      );
      
      await Order.update(
        { refund_status: Order.REFUND_STATUS_PENDING }, 
        { where: { id: order.id }, transaction }
      );
      
      const message = await Message.create(
        { 
          transaction_id: tx.id, 
          sender_id: tx.user_id,
          application: Message.APPLICATION_ROLE_RECEIVER,
          notification: Message.NOTIFICATION_TRANSACTION_CREATED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );

      return { transaction: tx, message };
    });
  },

  updatePaymentVerifed(reference, referenceGenerator) {

    return sequelize.transaction(async (transaction)=> {
      
      const tx = await Transaction.findOne({
        where: { reference, status: Transaction.STATUS_PENDING },
        include: {
          model: Order,
          include:[
            {
              model: Customer,
            },
            {
              model: Store,
            },
            {
              model: DeliveryFirm,
            }
          ]
        },
        transaction
      });

      if (tx === null) return false;

      await Transaction.update(
        { status: Transaction.STATUS_APPROVED }, 
        { where: { reference }, transaction }
      );

      await Order.update(
        { payment_status: Order.PAYMENT_STATUS_APPROVED }, 
        { where: { id: tx.order.id }, transaction }
      );
      
      if (tx.order.status === Order.STATUS_PROCESSING || tx.order.status === Order.STATUS_FULFILLED) {
        await Transaction.bulkCreate(
          await Transaction.distributeOrderPayment(tx.order, referenceGenerator), 
          { transaction }
        );
      }

      const message = await Message.create(
        { 
          transaction_id: tx.id, 
          receiver_id: tx.user_id,
          application: Message.APPLICATION_ROLE_SENDER,
          notification: Message.NOTIFICATION_TRANSACTION_APPROVED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );
      
      return message;
    });
  },

  updateTransferVerifed(reference) {

    return sequelize.transaction(async (transaction)=> {
      
      const tx = await Transaction.findOne({
        where: { reference, status: Transaction.STATUS_PROCESSING },
        include: { model: Order },
        transaction
      });

      if (tx === null) return false;

      await Transaction.update(
        { status: Transaction.STATUS_APPROVED }, 
        { where: { reference }, transaction }
      );

      if (tx.type === Transaction.TYPE_REFUND) {
        await Order.update(
          { refund_status: Order.REFUND_STATUS_APPROVED }, 
          { where: { id: tx.order.id }, transaction }
        );
      }

      const message = await Message.create(
        { 
          transaction_id: tx.id, 
          receiver_id: tx.user_id,
          application: Message.APPLICATION_ROLE_SENDER,
          notification: Message.NOTIFICATION_TRANSACTION_APPROVED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );
      
      return message;
    });
  },

  updateTransferFailed(reference) {

    return sequelize.transaction(async (transaction)=> {
      
      const tx = await Transaction.findOne({
        where: { reference, status: Transaction.STATUS_PROCESSING },
        include: { model: Order },
        transaction
      });

      if (tx === null) return false;

      await Transaction.update(
        { status: Transaction.STATUS_FAILED }, 
        { where: { reference }, transaction }
      );

      if (tx.type === Transaction.TYPE_REFUND) {
        await Order.update(
          { refund_status: Order.REFUND_STATUS_FAILED }, 
          { where: { id: tx.order.id }, transaction }
        );
      }

      const message = await Message.create(
        { 
          transaction_id: tx.id, 
          receiver_id: tx.user_id,
          application: Message.APPLICATION_ROLE_SENDER,
          notification: Message.NOTIFICATION_TRANSACTION_FAILED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );
      
      return message;
    });
  },
  
  updateStatusCancelled(tx, status) {

    return sequelize.transaction(async (transaction)=> {

      const update = await Transaction.update({ status }, { where: { id: tx.id }, transaction });

      if (tx.type === Transaction.TYPE_REFUND) {
        await Order.update(
          { refund_status: Order.REFUND_STATUS_CANCELLED }, 
          { where: { id: tx.order.id }, transaction }
        );
      }

      const message = await Message.create(
        { 
          transaction_id: tx.id, 
          sender_id: tx.user_id,
          application: Message.APPLICATION_ROLE_RECEIVER,
          notification: Message.NOTIFICATION_TRANSACTION_CANCELLED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );

      return { update, message };
    });
  },

  updateStatusToDeclined(tx, status) {

    return sequelize.transaction(async (transaction)=> {

      const update = await Transaction.update({ status }, { where: { id: tx.id }, transaction });

      if (tx.type === Transaction.TYPE_REFUND) {
        await Order.update(
          { refund_status: Order.REFUND_STATUS_DECLINED }, 
          { where: { id: tx.order.id }, transaction }
        );
      }

      const message = await Message.create(
        { 
          transaction_id: tx.id, 
          receiver_id: tx.user_id,
          application: Message.APPLICATION_ROLE_SENDER,
          notification: Message.NOTIFICATION_TRANSACTION_DECLINED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );

      return { update, message };
    });
  },

  updateStatusToProcessing(tx) {
    
    // send request to paystack;

    return sequelize.transaction(async (transaction)=> {

      const update = await Transaction.update(
        { status: Transaction.STATUS_PROCESSING }, 
        { where: { id: tx.id }, transaction }
      );
      
      const message = await Message.create(
        { 
          transaction_id: tx.id, 
          receiver_id: tx.user_id,
          application: Message.APPLICATION_ROLE_SENDER,
          notification: Message.NOTIFICATION_TRANSACTION_PROCESSING,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );
      
      return { update, message };
    });
  },


};


const { Op } = require("sequelize");
const Customer = require("../models/Customer");
const DeliveryFirm = require("../models/DeliveryFirm");
const Order = require("../models/Order");
const Store = require("../models/Store");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async referenceExists(reference) {
    const tx = await Transaction.findOne({ attributes: ['id'], where: { reference } });
    return tx !== null;
  },

  get(id) {
    return Transaction.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: User.GET_ATTR
        },
        {
          model: Order
        }
      ]
    });
  },

  getBalance(user_id) {
    return Transaction.sum('amount', { 
      where: { 
        user_id,
        status: {
          [Op.notIn]: [Transaction.STATUS_CANCELLED, Transaction.STATUS_DECLINED, Transaction.STATUS_FAILED]
        }
      } 
    });
  },

  createWithdrawal({ user_id, amount }, reference) {
    return Transaction.create({ 
      user_id,
      amount,
      reference,
      application: false,
      status: Transaction.STATUS_PENDING,
      type: Transaction.TYPE_WITHDRAWAL
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

      await Transaction.update({ status: Transaction.STATUS_APPROVED }, { where: { reference }, transaction });

      await Order.update({ payment_status: Order.PAYMENT_STATUS_APPROVED }, { where: { id: tx.order.id }, transaction });
      
      if (tx.order.status === Order.STATUS_PROCESSING || tx.order.status === Order.STATUS_FULFILLED) {
        await Transaction.bulkCreate(await Transaction.distributeOrderPayment(tx.order, referenceGenerator), { transaction });
      } else if (tx.order.status === Order.STATUS_CANCELLED || tx.order.status === Order.STATUS_DECLINED) {
        await Transaction.create(await Transaction.issueOrderRefund(tx.order, referenceGenerator), { transaction });
      }

      return true;
    });
  },

  updateStatusToDeclinedOrCancelled(tx, status) {
    return sequelize.transaction(async (transaction)=> {

      const update = await Transaction.update({ status }, { where: { id: tx.id }, transaction });

      if (tx.type === Transaction.TYPE_REFUND && status === Transaction.STATUS_CANCELLED) {

      } else if (tx.type === Transaction.TYPE_REFUND && status === Transaction.STATUS_DECLINED) {

      }

      return update;
    });
  },

  updateStatusToProcessing(tx) {
    return Transaction.findOne({ where: { id: tx.id } });
  },


};


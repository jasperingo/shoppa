const { Op } = require("sequelize");
const StringGenerator = require("../http/StringGenerator");
const Customer = require("../models/Customer");
const DeliveryFirm = require("../models/DeliveryFirm");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Store = require("../models/Store");
const Transaction = require("../models/Transaction");
const sequelize = require("./DB");

module.exports = {

  async referenceExists(reference) {
    const tx = await Transaction.findOne({ attributes: ['id'], where: { reference } });
    return tx !== null;
  },

  getAmountSumByUser(user_id) {
    return Transaction.sum('amount', { 
      where: { 
        user_id,
        status: {
          [Op.notIn]: [Transaction.STATUS_CANCELLED, Transaction.STATUS_DECLINED, Transaction.STATUS_FAILED]
        }
      } 
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
  }

};


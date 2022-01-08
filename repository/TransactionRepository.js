const StringGenerator = require("../http/StringGenerator");
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

  updatePaymentVerifed(reference) {

    return sequelize.transaction(async (transaction)=> {
      
      const tx = await Transaction.findOne({
        where: { reference, status: Transaction.STATUS_PENDING },
        include: {
          model: Order,
          include: {
            model: OrderItem
          }
        },
        transaction
      });


      if (tx === null) return;

      await Transaction.update({ status: Transaction.STATUS_APPROVED }, { where: { reference }, transaction });

      if (tx.order.payment_status === Order.PAYMENT_STATUS_PENDING) {
        await Order.update({ payment_status: Order.PAYMENT_STATUS_APPROVED }, { where: { id: tx.order.id }, transaction });
      }

      if (tx.order.status !== Order.STATUS_PROCESSING && tx.order.status !== Order.STATUS_FULFILLED) return;

      let storeMoney = 0, deliveryMoney = 0;

      for (let item of tx.order.order_items) {

        storeMoney += item.amount;

        if (item.discount_amount !== null) {
          storeMoney -= item.discount_amount;
        }

        if (item.delivery_weight_fee !== null) {
          deliveryMoney += item.delivery_weight_fee;
        }

        if (item.delivery_duration_fee !== null) {
          deliveryMoney += item.delivery_duration_fee;
        }
      }

      const storeCharge = Transaction.getStoreCharge(storeMoney);

      const deliveryCharge = Transaction.getDeliveryFirmCharge(deliveryMoney);

      const store = await Store.findOne({
        attributes: ['user_id'],
        where: { id: tx.order.store_id },
        transaction
      });

      const rows = [
        { 
          application: false, 
          order_id: tx.order.id, 
          user_id: store.user_id, 
          reference: await StringGenerator.transactionReference(this.referenceExists),
          amount: storeMoney,
          status: Transaction.STATUS_APPROVED,
          type: Transaction.TYPE_INCOME
        },
        { 
          application: false, 
          order_id: tx.order.id, 
          user_id: store.user_id, 
          reference: await StringGenerator.transactionReference(this.referenceExists),
          amount: -storeCharge,
          status: Transaction.STATUS_APPROVED,
          type: Transaction.TYPE_CHARGE
        },
        {
          application: true, 
          order_id: tx.order.id, 
          user_id: null, 
          reference: await StringGenerator.transactionReference(this.referenceExists),
          amount: storeCharge,
          status: Transaction.STATUS_APPROVED,
          type: Transaction.TYPE_INCOME
        },
      ];

      if (deliveryMoney > 0 && deliveryCharge > 0) {

        const deliveryFirm = await DeliveryFirm.findOne({
          attributes: ['user_id'],
          where: { id: tx.order.delivery_firm_id },
          transaction
        });

        rows.push({
          application: false, 
          order_id: tx.order.id, 
          user_id: deliveryFirm.user_id, 
          reference: await StringGenerator.transactionReference(this.referenceExists),
          amount: deliveryMoney,
          status: Transaction.STATUS_APPROVED,
          type: Transaction.TYPE_INCOME
        });

        rows.push({
          application: false, 
          order_id: tx.order.id, 
          user_id: deliveryFirm.user_id, 
          reference: await StringGenerator.transactionReference(this.referenceExists),
          amount: -deliveryCharge,
          status: Transaction.STATUS_APPROVED,
          type: Transaction.TYPE_CHARGE
        });

        rows.push({
          application: true, 
          order_id: tx.order.id, 
          user_id: null, 
          reference: await StringGenerator.transactionReference(this.referenceExists),
          amount: deliveryCharge,
          status: Transaction.STATUS_APPROVED,
          type: Transaction.TYPE_INCOME
        });
      }

      await Transaction.bulkCreate(rows, { transaction });

      return true;
    });
  }

};

